from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models.models import LeaveRequest, Attendance
from app.services.groq_service import flag_leave_patterns
from datetime import datetime

router = APIRouter()


def parse_date(d):
    if isinstance(d, str):
        return datetime.strptime(d, "%Y-%m-%d").date()
    return d


@router.get("/")
def all_leaves(session: Session = Depends(get_session)):
    return session.exec(select(LeaveRequest)).all()


@router.get("/employee/{employee_id}")
def employee_leaves(employee_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(LeaveRequest).where(LeaveRequest.employee_id == employee_id)
    ).all()


@router.post("/")
def apply_leave(leave: LeaveRequest, session: Session = Depends(get_session)):
    leave.id = None
    leave.start_date = parse_date(leave.start_date)
    leave.end_date = parse_date(leave.end_date)

    history = session.exec(
        select(LeaveRequest).where(LeaveRequest.employee_id == leave.employee_id)
    ).all()
    history_list = [
        {"start": str(l.start_date), "end": str(l.end_date), "type": l.leave_type}
        for l in history
    ]
    try:
        leave.ai_flag = flag_leave_patterns(history_list)
    except Exception:
        leave.ai_flag = "No unusual patterns detected."

    session.add(leave)
    session.commit()
    session.refresh(leave)
    return leave


@router.patch("/{leave_id}/approve")
def approve_leave(
    leave_id: int, comment: str = "", session: Session = Depends(get_session)
):
    leave = session.get(LeaveRequest, leave_id)
    leave.status = "approved"
    leave.manager_comment = comment
    session.commit()
    return leave


@router.patch("/{leave_id}/reject")
def reject_leave(
    leave_id: int, comment: str = "", session: Session = Depends(get_session)
):
    leave = session.get(LeaveRequest, leave_id)
    leave.status = "rejected"
    leave.manager_comment = comment
    session.commit()
    return leave


@router.post("/attendance")
def mark_attendance(attendance: Attendance, session: Session = Depends(get_session)):
    attendance.id = None
    attendance.date = parse_date(attendance.date)
    session.add(attendance)
    session.commit()
    session.refresh(attendance)
    return attendance


@router.get("/attendance/{employee_id}")
def get_attendance(employee_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(Attendance).where(Attendance.employee_id == employee_id)
    ).all()
