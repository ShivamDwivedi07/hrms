from fastapi import APIRouter, Depends, UploadFile, File
from sqlmodel import Session, select
from app.database import get_session
from app.models.models import OnboardingTask, PolicyDocument, ChatLog
from app.services.groq_service import answer_from_documents
from datetime import datetime
import PyPDF2, shutil, os

router = APIRouter()


def parse_date(d):
    if isinstance(d, str):
        return datetime.strptime(d, "%Y-%m-%d").date()
    return d


@router.post("/documents")
async def upload_policy(
    file: UploadFile = File(...), session: Session = Depends(get_session)
):
    path = f"uploads/policy_{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    text = ""
    try:
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""
    except Exception:
        text = "Could not extract text from document."
    doc = PolicyDocument(filename=file.filename, content=text)
    session.add(doc)
    session.commit()
    return {"message": "Uploaded", "filename": file.filename}


@router.get("/documents")
def list_documents(session: Session = Depends(get_session)):
    return session.exec(select(PolicyDocument)).all()


@router.post("/chatbot")
def chatbot(question: str, session: Session = Depends(get_session)):
    docs = session.exec(select(PolicyDocument)).all()
    context = "\n\n".join([f"[{d.filename}]:\n{d.content}" for d in docs])
    hr_email = os.getenv("HR_EMAIL", "hr@company.com")
    try:
        answer = answer_from_documents(question, context, hr_email)
    except Exception:
        answer = f"I don't have that info. Please contact HR at {hr_email}"
    log = ChatLog(question=question, answer=answer)
    session.add(log)
    session.commit()
    return {"question": question, "answer": answer}


@router.get("/chatbot/logs")
def chat_logs(session: Session = Depends(get_session)):
    return session.exec(select(ChatLog)).all()


@router.get("/tasks/{employee_id}")
def get_tasks(employee_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(OnboardingTask).where(OnboardingTask.employee_id == employee_id)
    ).all()


@router.post("/tasks")
def create_task(task: OnboardingTask, session: Session = Depends(get_session)):
    task.id = None
    if task.due_date:
        task.due_date = parse_date(task.due_date)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.patch("/tasks/{task_id}/complete")
def complete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(OnboardingTask, task_id)
    task.completed = True
    session.commit()
    return task
