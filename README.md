# AI-Powered HRMS 🤖

A fully functional Human Resource Management System with AI integrated into every core workflow — built with FastAPI, React, and Google Gemini AI.

## 🚀 Live Demo

- Frontend: https://hrms-omega-drab.vercel.app
- Backend API: https://hrms-backend-e7zm.onrender.com/docs

## 🎥 Demo Video

[Watch Demo] https://drive.google.com/file/d/1PlEQjtC6IsRw6b0G6Z-7Hc6OtDx3C3WK/view?usp=sharing

## 🛠 Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React.js, Vite, TailwindCSS         |
| Backend  | FastAPI, Python                     |
| Database | SQLite + SQLModel                   |
| AI/LLM   | Google Gemini AI (gemini-2.0-flash) |

## ✨ Features

### Module 1 — Employee Records

- Add, edit, deactivate employees
- AI auto-generates professional bio on creation
- Export employee list as CSV
- Search by department/designation

### Module 2 — Recruitment & ATS

- Post job openings with descriptions
- Upload candidate resumes (PDF)
- AI scores resume vs job description (0-100%)
- AI highlights top 3 strengths and 2 gaps
- AI generates 5 tailored interview questions
- Kanban pipeline: Applied → Screening → Interview → Offer → Hired/Rejected

### Module 3 — Leave Management

- Apply for sick/casual/earned/WFH leaves
- Manager approve/reject with comments
- AI flags unusual leave patterns
- Attendance marking

### Module 4 — Performance Reviews

- Create review cycles with self-assessment
- Manager ratings on 5 parameters
- AI generates balanced review summary
- AI flags rating mismatches
- AI suggests 3 development actions

### Module 5 — Onboarding Assistant

- Upload company policy documents (PDF)
- AI chatbot answers questions from documents only
- No hallucination — answers only from uploaded docs
- Onboarding task checklist

### Module 6 — HR Analytics

- Headcount by department (bar chart)
- Attrition rate tracking
- Open vs filled positions
- AI-generated monthly HR summary

## 🏃 How to Run Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- Google Gemini API key (free at https://aistudio.google.com/apikey)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file in backend folder:
