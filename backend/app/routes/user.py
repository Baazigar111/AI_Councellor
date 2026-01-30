from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database
from typing import List, Optional
from fastapi.responses import Response
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import simpleSplit
from io import BytesIO

router = APIRouter()

# --- DEPENDENCY ---
def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(database.get_db)):
    payload = auth.verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    email: str = payload.get("sub")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- ROUTES ---

@router.get("/download-sop")
def download_sop(current_user: models.User = Depends(get_current_user)):
    if not current_user.profile or not current_user.profile.sop_content:
        raise HTTPException(status_code=404, detail="No SOP found to download")

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    p.setFont("Helvetica-Bold", 18)
    p.drawCentredString(width/2, height - 50, "Statement of Purpose")
    
    p.setFont("Helvetica", 10)
    p.drawString(72, height - 80, f"Applicant: {current_user.full_name}")
    p.drawString(72, height - 95, f"Email: {current_user.email}")
    p.line(72, height - 105, width - 72, height - 105)
    
    text_object = p.beginText(72, height - 130)
    text_object.setFont("Helvetica", 11)
    text_object.setLeading(14) 
    
    max_width = width - 144 
    paragraphs = current_user.profile.sop_content.split('\n')
    
    for para in paragraphs:
        if not para.strip():
            text_object.textLine("") 
            continue
        
        wrapped_lines = simpleSplit(para, "Helvetica", 11, max_width)
        for line in wrapped_lines:
            text_object.textLine(line)
        text_object.textLine("") 
    
    p.drawText(text_object)
    p.showPage()
    p.save()

    buffer.seek(0)
    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=SOP_{current_user.full_name.replace(' ', '_')}.pdf"}
    )

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.post("/onboarding", response_model=schemas.UserResponse)
def complete_onboarding(profile_data: schemas.ProfileCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    try:
        profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
        if not profile:
            profile = models.Profile(user_id=current_user.id)
            db.add(profile)
        
        update_data = profile_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        
        # FIXED: Updated to match your simplified UserStage names
        if current_user.current_stage == models.UserStage.ONBOARDING:
            current_user.current_stage = models.UserStage.DISCOVERY
            
        db.commit()
        db.refresh(current_user)
        return current_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/universities", response_model=List[schemas.UniversityBase])
def get_universities(country: Optional[str] = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.University)
    if country:
        query = query.filter(models.University.country == country)
    return query.all()

@router.post("/tasks/{task_id}/toggle")
def toggle_task(
    task_id: int, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id, 
        models.Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.is_completed = not task.is_completed
    db.commit()
    return {"status": "success", "is_completed": task.is_completed}

@router.post("/shortlist/{uni_id}")
def toggle_shortlist(uni_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    uni = db.query(models.University).filter(models.University.id == uni_id).first()
    if not uni:
        raise HTTPException(status_code=404, detail="University not found")
    
    if uni in current_user.shortlisted_universities:
        current_user.shortlisted_universities.remove(uni)
        action = "removed"
    else:
        current_user.shortlisted_universities.append(uni)
        action = "added"
        # Progress the user to SHORTLISTED stage
        if current_user.current_stage == models.UserStage.DISCOVERY:
            current_user.current_stage = models.UserStage.SHORTLISTED
    
    db.commit()
    db.refresh(current_user)
    return {"message": f"University {action} successfully"}