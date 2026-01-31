import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, user, ai
from fastapi.responses import RedirectResponse

# Create tables in the database
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
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ai-councellor-ten.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # CRITICAL: This allows the browser to see the filename and download the file
    expose_headers=["Content-Disposition"], 
)

# --- ROUTES ---
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/user", tags=["User Profile & Stages"])
app.include_router(ai.router, prefix="/ai", tags=["AI Counsellor"])

@app.get("/health")
def health_check():
    return {"status": "active", "database": "connected"}

@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)