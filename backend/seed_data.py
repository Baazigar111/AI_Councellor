from app.database import SessionLocal, engine
from app import models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# PASTE YOUR NEON URL HERE DIRECTLY
NEON_URL = "postgresql://neondb_owner:npg_msJipDQ38wAX@ep-odd-waterfall-aeciwxaa-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(NEON_URL)
SessionLocal = sessionmaker(bind=engine)

def seed_universities():
    db = SessionLocal()
    # Check if we already have data to avoid duplicates
    if db.query(models.University).first():
        print("Database already seeded.")
        return

    unis = [
        # India
        {"name": "Brainware University", "country": "India", "avg_cost": 1500, "ranking_tier": 3, "acceptance_difficulty": "Moderate"},
        {"name": "IIT Bombay", "country": "India", "avg_cost": 2000, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        {"name": "Jadavpur University", "country": "India", "avg_cost": 500, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        
        # USA
        {"name": "MIT", "country": "USA", "avg_cost": 55000, "ranking_tier": 1, "acceptance_difficulty": "Extreme"},
        {"name": "Stanford University", "country": "USA", "avg_cost": 52000, "ranking_tier": 1, "acceptance_difficulty": "Extreme"},
        {"name": "Arizona State University", "country": "USA", "avg_cost": 30000, "ranking_tier": 2, "acceptance_difficulty": "Moderate"},
        
        # UK
        {"name": "University of Oxford", "country": "UK", "avg_cost": 40000, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        {"name": "University of Manchester", "country": "UK", "avg_cost": 25000, "ranking_tier": 1, "acceptance_difficulty": "Moderate"},
        
        # Germany (Low Cost Leaders)
        {"name": "Technical University of Munich", "country": "Germany", "avg_cost": 0, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        {"name": "RWTH Aachen University", "country": "Germany", "avg_cost": 0, "ranking_tier": 1, "acceptance_difficulty": "Moderate"},
        
        # Canada
        {"name": "University of Toronto", "country": "Canada", "avg_cost": 35000, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        {"name": "University of British Columbia", "country": "Canada", "avg_cost": 32000, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        
        # Australia
        {"name": "University of Melbourne", "country": "Australia", "avg_cost": 30000, "ranking_tier": 1, "acceptance_difficulty": "Moderate"},
        {"name": "UNSW Sydney", "country": "Australia", "avg_cost": 28000, "ranking_tier": 1, "acceptance_difficulty": "Moderate"},
        
        # More Options
        {"name": "National University of Singapore", "country": "Singapore", "avg_cost": 25000, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        {"name": "ETH Zurich", "country": "Switzerland", "avg_cost": 2000, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        {"name": "Delft University of Technology", "country": "Netherlands", "avg_cost": 15000, "ranking_tier": 1, "acceptance_difficulty": "Moderate"},
        {"name": "University of Tokyo", "country": "Japan", "avg_cost": 10000, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
        {"name": "Humboldt University", "country": "Germany", "avg_cost": 0, "ranking_tier": 2, "acceptance_difficulty": "Easy"},
        {"name": "Georgia Tech", "country": "USA", "avg_cost": 32000, "ranking_tier": 1, "acceptance_difficulty": "Hard"},
    ]

    for uni_data in unis:
        uni = models.University(**uni_data)
        db.add(uni)
    
    db.commit()
    print(f"Successfully seeded {len(unis)} universities!")
    db.close()

if __name__ == "__main__":
    seed_universities()