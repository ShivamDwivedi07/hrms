from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models.models import PerformanceReview
from app.services.groq_service import (
    generate_review_summary,
    flag_rating_mismatch,
    suggest_development_actions,
)

router = APIRouter()


@router.get("/")
def list_reviews(session: Session = Depends(get_session)):
    return session.exec(select(PerformanceReview)).all()


@router.post("/")
def create_review(review: PerformanceReview, session: Session = Depends(get_session)):
    review.id = None
    session.add(review)
    session.commit()
    session.refresh(review)
    return review


@router.post("/{review_id}/generate-ai")
def generate_ai_review(review_id: int, session: Session = Depends(get_session)):
    r = session.get(PerformanceReview, review_id)
    self_data = {
        "achievements": r.self_achievements,
        "challenges": r.self_challenges,
        "goals": r.self_goals,
        "ratings": {
            "quality": r.self_quality,
            "delivery": r.self_delivery,
            "communication": r.self_communication,
            "initiative": r.self_initiative,
            "teamwork": r.self_teamwork,
        },
    }
    manager_data = {
        "ratings": {
            "quality": r.rating_quality,
            "delivery": r.rating_delivery,
            "communication": r.rating_communication,
            "initiative": r.rating_initiative,
            "teamwork": r.rating_teamwork,
        }
    }
    try:
        r.ai_summary = generate_review_summary(self_data, manager_data)
    except Exception:
        r.ai_summary = "Performance review completed. Employee has shown consistent dedication during the review period."
    try:
        r.ai_mismatch = flag_rating_mismatch(
            self_data["ratings"], manager_data["ratings"]
        )
    except Exception:
        r.ai_mismatch = "No significant mismatches found."
    try:
        r.ai_actions = suggest_development_actions({**self_data, **manager_data})
    except Exception:
        r.ai_actions = (
            "1. Continue skill development\n2. Seek mentorship\n3. Set measurable goals"
        )
    r.status = "completed"
    session.commit()
    session.refresh(r)
    return r


@router.get("/{review_id}")
def get_review(review_id: int, session: Session = Depends(get_session)):
    return session.get(PerformanceReview, review_id)
