from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models.models import Employee, JobPosting, LeaveRequest
from app.services.groq_service import generate_hr_summary

router = APIRouter()


@router.get("/summary")
def get_summary(session: Session = Depends(get_session)):
    employees = session.exec(select(Employee)).all()
    jobs = session.exec(select(JobPosting)).all()
    leaves = session.exec(select(LeaveRequest)).all()

    dept_count = {}
    for e in employees:
        dept_count[e.department] = dept_count.get(e.department, 0) + 1

    active = [e for e in employees if e.status == "active"]
    inactive = [e for e in employees if e.status == "inactive"]
    open_jobs = [j for j in jobs if j.status == "open"]
    approved_leaves = [l for l in leaves if l.status == "approved"]

    data = {
        "total_employees": len(employees),
        "active_employees": len(active),
        "inactive_employees": len(inactive),
        "headcount_by_department": dept_count,
        "open_positions": len(open_jobs),
        "total_leave_requests": len(leaves),
        "approved_leaves": len(approved_leaves),
        "attrition_rate": round(len(inactive) / max(len(employees), 1) * 100, 2),
    }

    return {**data, "ai_summary": generate_hr_summary(data)}
