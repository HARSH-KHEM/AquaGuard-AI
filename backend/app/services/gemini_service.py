import google.generativeai as genai
from ..config import settings
from .risk_engine import get_locality_detail
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

def get_chat_response(message: str, locality_id: str = None) -> str:
    if not model:
        return "Gemini API key is not configured. Returning fallback response."
    
    system_prompt = (
        "You are Hydra, the AI assistant for AquaGuard AI, a predictive water contamination "
        "forecasting platform for Delhi-NCR. You answer questions about water safety, "
        "contamination risks, and precautions. Keep responses concise (2-4 sentences). "
    )
    
    if locality_id:
        loc = get_locality_detail(locality_id)
        if loc:
            system_prompt += (
                f"\nThe user is inquiring about {loc.name}. "
                f"Current Risk Score: {loc.risk_score} ({loc.risk_level}). "
                f"Primary Risk: {loc.primary_disease_risk}. "
                f"Sensors: pH={loc.sensors.ph}, Turbidity={loc.sensors.turbidity} NTU, "
                f"Chlorine={loc.sensors.chlorine} mg/L, E.coli={loc.sensors.ecoli}."
            )

    try:
        response = model.generate_content(
            contents=[
                {"role": "user", "parts": [system_prompt + "\n\nUser Question: " + message]}
            ]
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini API Error: {str(e)}")
        return "I am currently unable to reach my core analysis engine. Please refer to the dashboard charts for immediate risk assessments."
