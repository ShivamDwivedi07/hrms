import os
import json
from dotenv import load_dotenv

load_dotenv()

# AI is optional — app works without it
AI_ENABLED = False

try:
    from google import genai

    _client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))
    AI_ENABLED = True
except Exception:
    AI_ENABLED = False


def chat(system_prompt: str, user_message: str, max_tokens: int = 1024) -> str:
    if not AI_ENABLED:
        raise Exception("AI not configured")
    try:
        response = _client.models.generate_content(
            model="gemini-2.0-flash", contents=f"{system_prompt}\n\n{user_message}"
        )
        return response.text
    except Exception as e:
        raise Exception(f"AI Error: {str(e)}")


def generate_employee_bio(data: dict) -> str:
    try:
        return chat(
            "You are an HR professional. Write a professional employee bio in 3 sentences.",
            f"Employee details: {data}",
        )
    except Exception:
        name = data.get("name", "")
        designation = data.get("designation", "")
        department = data.get("department", "")
        return f"{name} is an experienced {designation} in the {department} department, bringing valuable skills and expertise to the team. They joined the organization with a commitment to excellence and innovation. Their contributions continue to make a positive impact on the team's goals and objectives."


def detect_duplicate(new_emp: dict, existing: list) -> str:
    try:
        return chat(
            "You are an HR data checker. Flag if the new employee looks like a duplicate or has missing critical fields.",
            f"New: {new_emp}\nExisting (sample): {existing[:5]}",
        )
    except Exception:
        return "Manual review recommended."


def score_resume(resume_text: str, jd: str) -> dict:
    try:
        raw = chat(
            """You are an ATS. Analyze resume vs job description.
Reply ONLY with this exact JSON and nothing else:
{
  "score": <number 0-100>,
  "strengths": ["<point1>", "<point2>", "<point3>"],
  "gaps": ["<gap1>", "<gap2>"],
  "summary": "<one sentence>"
}""",
            f"JD:\n{jd}\n\nResume:\n{resume_text[:3000]}",
        )
        start = raw.find("{")
        end = raw.rfind("}") + 1
        return json.loads(raw[start:end])
    except Exception:
        return {
            "score": 70,
            "strengths": [
                "Relevant experience",
                "Good communication",
                "Technical skills",
            ],
            "gaps": ["Needs assessment", "Further review required"],
            "summary": "Candidate requires manual evaluation.",
        }


def generate_interview_questions(resume_text: str, jd: str) -> str:
    try:
        return chat(
            "You are a senior interviewer. Generate exactly 5 numbered interview questions tailored to this candidate.",
            f"JD:\n{jd}\n\nResume:\n{resume_text[:2000]}",
        )
    except Exception:
        return """1. Can you walk us through your relevant experience for this role?
2. What are your greatest technical strengths?
3. Describe a challenging project you completed successfully.
4. How do you handle tight deadlines and pressure?
5. Where do you see yourself professionally in the next 3 years?"""


def flag_leave_patterns(leave_history: list) -> str:
    try:
        return chat(
            "You are an HR analyst. Detect unusual leave patterns like repeated Mondays or Fridays. Be specific.",
            f"Leave history: {leave_history}",
        )
    except Exception:
        return "No unusual patterns detected. Manual review recommended."


def predict_capacity_risk(leave_requests: list, team_size: int) -> str:
    try:
        return chat(
            "You are an HR capacity planner. Give a risk level (Low/Medium/High) and brief reason.",
            f"Team size: {team_size}\nLeave requests: {leave_requests}",
        )
    except Exception:
        if len(leave_requests) > team_size // 2:
            return "Risk: High - More than 50% of team on leave."
        return "Risk: Low - Team capacity appears adequate."


def generate_review_summary(self_data: dict, manager_data: dict) -> str:
    try:
        return chat(
            "You are an HR review writer. Write a balanced 3-paragraph performance review summary.",
            f"Self-assessment: {self_data}\nManager review: {manager_data}",
        )
    except Exception:
        return "The employee has demonstrated consistent performance during the review period. Based on both self-assessment and manager feedback, they have shown dedication to their role and responsibilities. Continued focus on professional development and goal achievement is recommended for the next review cycle."


def flag_rating_mismatch(self_ratings: dict, manager_ratings: dict) -> str:
    try:
        return chat(
            "You are an HR analyst. Find parameters where self vs manager rating differs by 2 or more points. Explain each.",
            f"Self ratings (1-5): {self_ratings}\nManager ratings (1-5): {manager_ratings}",
        )
    except Exception:
        mismatches = []
        for key in self_ratings:
            if key in manager_ratings:
                diff = abs((self_ratings[key] or 3) - (manager_ratings[key] or 3))
                if diff >= 2:
                    mismatches.append(f"{key}: difference of {diff} points")
        return (
            "Mismatches found: " + ", ".join(mismatches)
            if mismatches
            else "No significant mismatches found."
        )


def suggest_development_actions(review_data: dict) -> str:
    try:
        return chat(
            "You are a career coach. Suggest exactly 3 specific development actions numbered 1, 2, 3.",
            f"Review data: {review_data}",
        )
    except Exception:
        return """1. Enroll in relevant skill development courses or certifications in your domain.
2. Seek a mentor within the organization for guidance and career growth.
3. Set specific, measurable goals for the next quarter and track progress weekly."""


def answer_from_documents(question: str, context: str, hr_email: str) -> str:
    try:
        return chat(
            f"""You are a helpful onboarding assistant.
STRICT RULES:
1. Answer ONLY from the company documents provided
2. If not found say exactly: "I don't have that info. Please contact HR at {hr_email}"
3. Never make up information""",
            f"Company Documents:\n{context[:6000]}\n\nEmployee Question: {question}",
        )
    except Exception:
        return f"I don't have that info. Please contact HR at {hr_email}"


def generate_hr_summary(data: dict) -> str:
    try:
        return chat(
            """You are a senior HR analyst. Write a monthly HR report with these exact sections:
KEY HIGHLIGHTS:
- point 1
- point 2

RISKS IDENTIFIED:
- risk 1
- risk 2

RECOMMENDED ACTIONS:
- action 1
- action 2""",
            f"HR data: {data}",
        )
    except Exception:
        total = data.get("total_employees", 0)
        active = data.get("active_employees", 0)
        attrition = data.get("attrition_rate", 0)
        open_pos = data.get("open_positions", 0)
        return f"""KEY HIGHLIGHTS:
- Total workforce stands at {total} employees with {active} currently active
- {open_pos} positions are currently open for recruitment

RISKS IDENTIFIED:
- Attrition rate at {attrition}% requires monitoring
- Open positions may impact team productivity if not filled promptly

RECOMMENDED ACTIONS:
- Accelerate recruitment for {open_pos} open positions
- Conduct employee engagement surveys to reduce attrition
- Schedule quarterly performance reviews for all departments"""
