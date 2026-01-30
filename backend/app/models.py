# app/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum, Text, DateTime, Table
# app/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum, Text, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class UserStage(str, enum.Enum):
    UNAUTHENTICATED = "UNAUTHENTICATED"
    ONBOARDING = "ONBOARDING"  # Simplified from ONBOARDING_INCOMPLETE
    ONBOARDING_COMPLETE = "ONBOARDING_COMPLETE"
    DISCOVERY = "DISCOVERY"
    SHORTLISTED = "SHORTLISTED"
    LOCKED = "LOCKED"
    APPLICATION_PREP = "APPLICATION_PREP"

user_university_shortlist = Table(
    "user_university_shortlist",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("university_id", Integer, ForeignKey("universities.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    # Default is now set to ONBOARDING
    current_stage = Column(Enum(UserStage), default=UserStage.ONBOARDING)
    
    profile = relationship("Profile", back_populates="owner", uselist=False)
    messages = relationship("ChatMessage", back_populates="owner")
    tasks = relationship("Task", back_populates="owner") 
    shortlisted_universities = relationship(
        "University", 
        secondary=user_university_shortlist, 
        backref="shortlisted_by"
    )

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String) 
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner = relationship("User", back_populates="messages")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner = relationship("User", back_populates="tasks")

class Profile(Base):
    __tablename__ = "profiles"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    education_level = Column(String, nullable=True)
    major = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    gpa = Column(Float, nullable=True)
    target_degree = Column(String, nullable=True)
    field = Column(String, nullable=True)
    intake_year = Column(Integer, nullable=True)
    preferred_countries = Column(String, nullable=True)
    budget_min = Column(Integer, nullable=True)
    budget_max = Column(Integer, nullable=True)
    funding_type = Column(String, nullable=True)
    
    # --- UPDATED DOCUMENT LOCKER FIELDS ---
    sop_content = Column(Text, nullable=True)
    is_sop_ready = Column(Boolean, default=False)
    # --------------------------------------

    owner = relationship("User", back_populates="profile")

class University(Base):
    __tablename__ = "universities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    country = Column(String)
    avg_cost = Column(Integer, nullable=True)
    ranking_tier = Column(Integer, nullable=True)
    acceptance_difficulty = Column(String, nullable=True)