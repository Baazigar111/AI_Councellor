import os
from groq import Groq  # <-- Swapped Google for Groq
from sqlalchemy.orm import Session
from fastapi import HTTPException
from .. import models

def get_ai_response(user: models.User, user_message: str, db: Session):
    # 1. Fetch Groq API Key
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Groq API Key missing")

    # Initialize the Groq Client
    client = Groq(api_key=api_key)
    
    # 2. Fetch Profile and Documents (Kept original logic)
    profile = db.query(models.Profile).filter(models.Profile.user_id == user.id).first()
    
    # 3. Fetch Universities (Kept original logic)
    available_unis = db.query(models.University).all()
    uni_list = "\n".join([f"- {u.name} ({u.country})" for u in available_unis])

    profile_context = ""
    sop_context = "USER_SAVED_SOP: None. The user hasn't written anything in their locker yet."
    
    if profile:
        profile_context = (
            f"USER_PROFILE: Major: {profile.major}, GPA: {profile.gpa}, "
            f"Budget: ${profile.budget_max}, Target Countries: {profile.preferred_countries}. "
        )
        if profile.sop_content and profile.sop_content.strip():
            sop_context = f"USER_SAVED_SOP (From Document Locker):\n\"\"\"\n{profile.sop_content}\n\"\"\""

    # 4. Enhanced System Prompt (Kept original rules)
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

    # 5. Execute AI call using Groq
    try:
        # llama-3.3-70b-versatile is a highly intelligent drop-in replacement for gemini-2.5-flash
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
        )
        # Extract the text content from the completion object
        return response.choices[0].message.content

    except Exception as e:
        print(f"Groq AI Error: {e}")
        # Automatically handles rate limits (429) or timeouts gracefully
        raise HTTPException(status_code=500, detail="AI Service Error")
