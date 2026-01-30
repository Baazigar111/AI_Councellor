import sys
import os

# Ensure the root directory is in the python path so it can find the 'app' module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
# IMPORTANT: You must import all models here. 
# SQLAlchemy's Base needs to "know" about them to drop/create them.
from app.models import User, Profile, ChatMessage, University, user_university_shortlist

def reset_database():
    print("--- Database Reset Tool ---")
    confirm = input("This will DELETE ALL DATA in your Neon database. Continue? (y/n): ")
    
    if confirm.lower() != 'y':
        print("Reset aborted.")
        return

    try:
        print("\n1. Connecting to Neon/Postgres...")
        
        # Drop all tables. Using 'checkfirst=True' is safer, 
        # but drop_all generally handles existing tables.
        print("2. Dropping all existing tables (Users, Profiles, Messages, Universities, Shortlists)...")
        Base.metadata.drop_all(bind=engine)
        print("   Success: Database cleared.")

        print("3. Recreating tables with updated schema...")
        # This creates all tables defined in models.py
        Base.metadata.create_all(bind=engine)
        print("   Success: Tables recreated.")

        print("\n--- RESET COMPLETE ---")
        print("You can now restart your FastAPI server with 'uvicorn app.main:app --reload'")
        print("Note: You will need to register a new user as all old accounts were deleted.")

    except Exception as e:
        print(f"\n[ERROR] Database reset failed: {e}")

if __name__ == "__main__":
    reset_database()