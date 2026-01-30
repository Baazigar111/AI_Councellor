from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import UserStage

# 1. UNIVERSITY SCHEMAS
class UniversityBase(BaseModel):
    id: int
    name: str
    country: str
    avg_cost: Optional[int] = None
    ranking_tier: Optional[int] = None
    acceptance_difficulty: Optional[str] = None

    class Config:
        from_attributes = True

# 2. TASK SCHEMAS (Moved up so UserResponse can see it)
class TaskResponse(BaseModel):
    id: int
    title: str
    is_completed: bool

    class Config:
        from_attributes = True

# 3. PROFILE SCHEMAS
class ProfileBase(BaseModel):
    major: Optional[str] = None
    gpa: Optional[float] = None
    budget_max: Optional[int] = None
    education_level: Optional[str] = None
    preferred_countries: Optional[str] = None
    sop_content: Optional[str] = None
    is_sop_ready: Optional[bool] = False

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    user_id: int
    class Config:
        from_attributes = True

# 4. USER SCHEMAS
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    full_name: str
    email: EmailStr
    current_stage: UserStage
    profile: Optional[ProfileResponse] = None
    shortlisted_universities: List[UniversityBase] = []
    # FIXED: Moved outside of Config and TaskResponse is now defined above
    tasks: List[TaskResponse] = [] 

    class Config:
        from_attributes = True

# 5. AUTH & AI SCHEMAS
class Token(BaseModel):
    access_token: str
    token_type: str

class ChatMessage(BaseModel):
    message: Optional[str] = None
    role: Optional[str] = None
    content: Optional[str] = None
    class Config:
        from_attributes = True

class AIResponse(BaseModel):
    response: str
    stage_updated: bool
    next_stage: UserStage