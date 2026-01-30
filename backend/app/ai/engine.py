import os
from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from fastapi import HTTPException
from .. import models

def get_ai_response(user: models.User, user_message: str, db: Session):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key missing")

    client = genai.Client(api_key=api_key)
    
    # 1. Fetch Profile and Documents
    profile = db.query(models.Profile).filter(models.Profile.user_id == user.id).first()
    
    # 2. Fetch Universities
    available_unis = db.query(models.University).all()
    uni_list = "\n".join([f"- {u.name} ({u.country})" for u in available_unis])

    profile_context = ""
    # Explicitly label this so the AI knows it's from the database
    sop_context = "USER_SAVED_SOP: None. The user hasn't written anything in their locker yet."
    
    if profile:
        profile_context = (
            f"USER_PROFILE: Major: {profile.major}, GPA: {profile.gpa}, "
            f"Budget: ${profile.budget_max}, Target Countries: {profile.preferred_countries}. "
        )
        if profile.sop_content and profile.sop_content.strip():
            sop_context = f"USER_SAVED_SOP (From Document Locker):\n\"\"\"\n{profile.sop_content}\n\"\"\""

    # 3. Enhanced System Prompt
    system_prompt = (
    "You are an expert Study Abroad Counsellor and Writing Coach. "
    f"Talking to {user.full_name}.\n\n"
    "--- CONTEXT ---\n"
    f"{profile_context}\n"
    f"{sop_context}\n"
    f"AVAILABLE_UNIS:\n{uni_list}\n"
    "--- END CONTEXT ---\n\n"
    "STRICT SHORT-RESPONSE RULES (TOKEN SAVING):\n"
    "1. Be extremely brief (under 60 words).\n"
    "2. TASK TRIGGER: If the user needs to take a specific action, wrap it like this: [TASK: Task description].\n"
    "Example: 'Your GPA is great. [TASK: Draft SOP for Brainware]'\n"
    "3. Use direct language. No 'Hello' or polite filler.\n"
    "4. Max 3 bullet points for feedback."
)

    # 4. Execute AI call (Using standard naming for reliability)
    model_names = ['gemini-2.5-flash']
    for model_name in model_names:
        try:
            response = client.models.generate_content(
                model=model_name, 
                contents=user_message,
                config=types.GenerateContentConfig(system_instruction=system_prompt)
            )
            return response.text
        except Exception as e:
            if "404" in str(e): continue
            print(f"AI Error ({model_name}): {e}")
            raise HTTPException(status_code=500, detail="AI Service Error")

    raise HTTPException(status_code=404, detail="No AI models available.")