from fastapi import APIRouter
from ..models.schemas import ChatRequest, ChatResponse
from ..services.gemini_service import get_chat_response
from datetime import datetime

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    reply = get_chat_response(request.message, request.locality_id)
    return ChatResponse(
        reply=reply,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

@router.get("/health")
def health_check():
    return {"status": "ok"}
