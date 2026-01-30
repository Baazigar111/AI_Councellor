from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, models, schemas
from ..ai.engine import get_ai_response
from .user import get_current_user
from typing import List
import re

router = APIRouter()

@router.post("/chat", response_model=schemas.AIResponse)
def chat_with_ai(
    payload: schemas.ChatMessage, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    try:
        db.refresh(current_user)

        # 1. Generate AI response
        ai_text = get_ai_response(current_user, payload.message, db)
        
        # 2. STAGE LOGIC: Transition from ONBOARDING to ONBOARDING_COMPLETE
        if current_user.current_stage == models.UserStage.ONBOARDING:
            current_user.current_stage = models.UserStage.ONBOARDING_COMPLETE

        # 3. Parse AI text for tasks: [TASK: Description]
        tasks_found = re.findall(r"\[TASK: (.*?)\]", ai_text)
        for task_title in tasks_found:
            exists = db.query(models.Task).filter(
                models.Task.user_id == current_user.id, 
                models.Task.title == task_title
            ).first()
            if not exists:
                new_task = models.Task(user_id=current_user.id, title=task_title)
                db.add(new_task)

        # 4. Clean tags out of response
        clean_response = re.sub(r"\[TASK: .*?\]", "", ai_text).strip()

        # 5. Save Chat History
        user_msg = models.ChatMessage(user_id=current_user.id, role="user", content=payload.message)
        ai_msg = models.ChatMessage(user_id=current_user.id, role="assistant", content=clean_response)
        
        db.add(user_msg)
        db.add(ai_msg)
        
        # Save all changes to the database
        db.commit()
        db.refresh(current_user)

        return {
            "response": clean_response,
            "stage_updated": True,
            "next_stage": current_user.current_stage.value
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[schemas.ChatMessage])
def get_chat_history(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.ChatMessage)\
        .filter(models.ChatMessage.user_id == current_user.id)\
        .order_by(models.ChatMessage.created_at.asc())\
        .all()