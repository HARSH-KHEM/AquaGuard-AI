from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import chat, citizen, dashboard
from app.routers.chat import health_check

app = FastAPI(title="AquaGuard AI Backend", version="1.0.0")

# CORS for hackathon demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(citizen.router, prefix="/api", tags=["citizen"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

# Need to map /api/health explicitly to health.py if it was separated, but it's in chat.py router for now.
# We'll explicitly mount a health check just in case.
@app.get("/api/health", tags=["health"])
def get_health():
    return {"status": "ok"}
