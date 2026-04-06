from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date, datetime


class Employee(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(default="")
    email: str = Field(default="")
    designation: str = Field(default="")
    department: str = Field(default="")
    joining_date: date
    manager: Optional[str] = Field(default=None)
    contact: Optional[str] = Field(default=None)
    skills: Optional[str] = Field(default=None)
    status: str = Field(default="active")
    bio: Optional[str] = Field(default=None)


class JobPosting(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    required_skills: str
    experience_level: str
    status: str = "open"


class Candidate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="jobposting.id")
    name: str
    email: str
    resume_path: Optional[str] = None
    stage: str = "Applied"
    ai_score: Optional[int] = None
    ai_strengths: Optional[str] = None
    ai_gaps: Optional[str] = None
    ai_summary: Optional[str] = None
    interview_questions: Optional[str] = None


class LeaveRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: int = Field(foreign_key="employee.id")
    leave_type: str
    start_date: date
    end_date: date
    reason: str
    status: str = "pending"
    manager_comment: Optional[str] = None
    ai_flag: Optional[str] = None


class Attendance(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: int = Field(foreign_key="employee.id")
    date: date
    status: str


class PerformanceReview(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: int = Field(foreign_key="employee.id")
    period: str
    self_achievements: Optional[str] = None
    self_challenges: Optional[str] = None
    self_goals: Optional[str] = None
    rating_quality: Optional[int] = None
    rating_delivery: Optional[int] = None
    rating_communication: Optional[int] = None
    rating_initiative: Optional[int] = None
    rating_teamwork: Optional[int] = None
    self_quality: Optional[int] = None
    self_delivery: Optional[int] = None
    self_communication: Optional[int] = None
    self_initiative: Optional[int] = None
    self_teamwork: Optional[int] = None
    ai_summary: Optional[str] = None
    ai_mismatch: Optional[str] = None
    ai_actions: Optional[str] = None
    status: str = "pending"


class OnboardingTask(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: int = Field(foreign_key="employee.id")
    task_name: str
    assignee: Optional[str] = None
    due_date: Optional[date] = None
    completed: bool = False


class PolicyDocument(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    content: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


class ChatLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str
    asked_at: datetime = Field(default_factory=datetime.utcnow)
