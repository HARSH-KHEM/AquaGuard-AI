from fastapi import APIRouter, HTTPException
from ..models.schemas import LocalityDetail, LocalitySummary
from ..services.risk_engine import get_locality_detail, get_all_localities_summary
from typing import List

router = APIRouter()

@router.get("/localities", response_model=List[LocalitySummary])
def get_localities():
    return get_all_localities_summary()

@router.get("/localities/{locality_id}", response_model=LocalityDetail)
def get_locality(locality_id: str):
    detail = get_locality_detail(locality_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Locality not found")
    return detail

@router.get("/citizen/{locality_id}")
def get_citizen_view(locality_id: str):
    detail = get_locality_detail(locality_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Locality not found")
    
    recommendation = "Water is safe for consumption."
    if detail.risk_score >= 80:
        recommendation = "HIGH RISK: Boil all water for at least 1 minute. Alternative sources recommended."
    elif detail.risk_score >= 60:
        recommendation = "WARNING: Boiling water is recommended for sensitive groups."
        
    return {
        "locality_id": detail.id,
        "name": detail.name,
        "risk_score": detail.risk_score,
        "disease_risks": detail.disease_risks,
        "forecast_chart": detail.forecast_trend,
        "safety_recommendation": recommendation
    }
