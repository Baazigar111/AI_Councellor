import os  # FIXED: Added the missing import
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, user, ai
from fastapi.responses import RedirectResponse

# Create tables in the database (Neon/Postgres)
try:
    Base.metadata.create_all(bind=engine)
    print("Successfully connected to the database and created tables.")
except Exception as e:
    print(f"Database connection failed: {e}")

app = FastAPI(
    title="AI Counsellor API",
    description="Backend engine for the AI Guided Study Abroad Platform",
    version="1.0.0"
)

# --- MIDDLEWARE ---
# Gets the FRONTEND_URL from environment variables (set this on Render later)
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

origins = [
    "http://localhost:3000",
    frontend_url, 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---
# Cleaned up duplicates
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/user", tags=["User Profile & Stages"])
app.include_router(ai.router, prefix="/ai", tags=["AI Counsellor"])

# --- HEALTH CHECK ---
@app.get("/health")
def health_check():
    return {
        "status": "active",
        "version": "1.0.0",
        "database": "connected"
    }

@app.get("/")
async def root():
    # Redirecting to /docs makes it easier to test the API in the browser
    return RedirectResponse(url="/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)