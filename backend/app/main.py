from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import (
    employees,
    recruitment,
    leaves,
    performance,
    onboarding,
    analytics,
)
import os

app = FastAPI(title="AI HRMS", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads folder if not exists
os.makedirs("uploads", exist_ok=True)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(recruitment.router, prefix="/api/recruitment", tags=["Recruitment"])
app.include_router(leaves.router, prefix="/api/leaves", tags=["Leaves"])
app.include_router(performance.router, prefix="/api/performance", tags=["Performance"])
app.include_router(onboarding.router, prefix="/api/onboarding", tags=["Onboarding"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])


@app.get("/")
def root():
    return {"message": "HRMS API running"}
