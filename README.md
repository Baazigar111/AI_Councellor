# 🎓 AI Counsellor

**AI Counsellor** is a high-end, full-stack mentor application designed to guide students through their international education journey. Built with a specialized AI-driven interface, it helps users discover universities, manage their Statement of Purpose (SOP), and track application milestones with a professional SaaS-grade experience.

---

## ✨ Features

* **AI-Powered Guidance:** Interactive chat interface for personalized university counseling and profile evaluation.
* **University Discovery:** Curated list of institutions matched to the user's GPA, major, and budget.
* **Professional SOP Locker:** A dedicated, distraction-free writing environment to draft and finalize Statements of Purpose.
* **PDF Export:** Generate a professionally formatted PDF of your SOP with a single click.
* **Smart Milestone Tracking:** Automated "AI To-Do List" that updates based on your current application stage.
* **Secure Auth & Onboarding:** JWT-based authentication with a multi-stage onboarding flow to personalize the user experience.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS v4 (Oxide Engine)
* **Icons/UI:** Lucide-React & Modern Glassmorphism Design

### Backend
* **Framework:** FastAPI (Python)
* **Database:** PostgreSQL via Neon DB
* **ORM:** SQLAlchemy
* **Authentication:** JWT (JSON Web Tokens) & OAuth2



---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* Python 3.9+
* Neon.tech (PostgreSQL) Account

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Baazigar111/AI_Councellor.git](https://github.com/Baazigar111/AI_Councellor.git)
    cd AI_Councellor
    ```

2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  **Backend Setup:**
    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

---

## 📂 Project Structure

* `/frontend`: Next.js application, Tailwind v4 configurations, and UI components.
* `/backend`: FastAPI server, SQLAlchemy models, and AI logic.
* `/backend/app/models.py`: Database schema for Users, Profiles, and Universities.
