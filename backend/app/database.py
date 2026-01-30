import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Load .env for local development
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# 2. Get URL from environment (Render/Railway) or use fallback
# In production, set DATABASE_URL in your hosting provider's dashboard
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    # Fallback to your Neon URL if no env variable is set
    SQLALCHEMY_DATABASE_URL = "postgresql://neondb_owner:npg_msJipDQ38wAX@ep-odd-waterfall-aeciwxaa-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 3. Fix for Heroku/Render legacy postgres prefix if necessary
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 4. Create Engine
# Note: connect_args is only needed for SQLite, not needed for Postgres
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()