from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlmodel import Session, select
from app.database import get_session
from app.models.models import JobPosting, Candidate
from app.services.groq_service import score_resume, generate_interview_questions
import PyPDF2, shutil

router = APIRouter()


@router.get("/jobs")
def list_jobs(session: Session = Depends(get_session)):
    return session.exec(select(JobPosting)).all()


@router.post("/jobs")
def create_job(job: JobPosting, session: Session = Depends(get_session)):
    session.add(job)
    session.commit()
    session.refresh(job)
    return job


@router.patch("/jobs/{job_id}/close")
def close_job(job_id: int, session: Session = Depends(get_session)):
    job = session.get(JobPosting, job_id)
    job.status = "closed"
    session.commit()
    return job


@router.get("/candidates/{job_id}")
def get_candidates(job_id: int, session: Session = Depends(get_session)):
    return session.exec(select(Candidate).where(Candidate.job_id == job_id)).all()


@router.post("/candidates/{job_id}")
async def add_candidate(
    job_id: int,
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    path = f"uploads/resume_{job_id}_{name.replace(' ', '_')}.pdf"
    with open(path, "wb") as f:
        shutil.copyfileobj(resume.file, f)
    text = ""
    with open(path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    job = session.get(JobPosting, job_id)
    result = score_resume(text, job.description)
    questions = generate_interview_questions(text, job.description)
    candidate = Candidate(
        job_id=job_id,
        name=name,
        email=email,
        resume_path=path,
        ai_score=result.get("score", 0),
        ai_strengths=str(result.get("strengths", [])),
        ai_gaps=str(result.get("gaps", [])),
        ai_summary=result.get("summary", ""),
        interview_questions=questions,
    )
    session.add(candidate)
    session.commit()
    session.refresh(candidate)
    return candidate


@router.patch("/candidates/{candidate_id}/stage")
def update_stage(
    candidate_id: int, stage: str, session: Session = Depends(get_session)
):
    c = session.get(Candidate, candidate_id)
    c.stage = stage
    session.commit()
    return c
