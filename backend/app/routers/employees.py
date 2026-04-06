from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from app.database import get_session
from app.models.models import Employee
from datetime import date
import csv, io

router = APIRouter()


@router.get("/")
def list_employees(session: Session = Depends(get_session)):
    return session.exec(select(Employee)).all()


@router.post("/")
def create_employee(employee: Employee, session: Session = Depends(get_session)):
    employee.id = None

    # Fix date if it comes as string
    if isinstance(employee.joining_date, str):
        from datetime import datetime

        employee.joining_date = datetime.strptime(
            employee.joining_date, "%Y-%m-%d"
        ).date()

    # Try AI bio, fallback if it fails
    try:
        from app.services.groq_service import generate_employee_bio

        employee.bio = generate_employee_bio(
            {
                "name": employee.name,
                "designation": employee.designation,
                "department": employee.department,
                "joining_date": str(employee.joining_date),
            }
        )
    except Exception:
        employee.bio = f"{employee.name} is an experienced {employee.designation} in the {employee.department} department, bringing valuable skills and expertise to the team."

    session.add(employee)
    session.commit()
    session.refresh(employee)
    return employee


@router.get("/export/csv")
def export_csv(session: Session = Depends(get_session)):
    employees = session.exec(select(Employee)).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        ["ID", "Name", "Email", "Department", "Designation", "Joining Date", "Status"]
    )
    for e in employees:
        writer.writerow(
            [
                e.id,
                e.name,
                e.email,
                e.department,
                e.designation,
                e.joining_date,
                e.status,
            ]
        )
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=employees.csv"},
    )


@router.get("/{employee_id}")
def get_employee(employee_id: int, session: Session = Depends(get_session)):
    emp = session.get(Employee, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp


@router.put("/{employee_id}")
def update_employee(
    employee_id: int, data: dict, session: Session = Depends(get_session)
):
    emp = session.get(Employee, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Not found")
    for key, val in data.items():
        if key == "joining_date" and isinstance(val, str):
            from datetime import datetime

            val = datetime.strptime(val, "%Y-%m-%d").date()
        setattr(emp, key, val)
    session.commit()
    session.refresh(emp)
    return emp


@router.patch("/{employee_id}/deactivate")
def deactivate(employee_id: int, session: Session = Depends(get_session)):
    emp = session.get(Employee, employee_id)
    emp.status = "inactive"
    session.commit()
    return {"message": "Deactivated"}
