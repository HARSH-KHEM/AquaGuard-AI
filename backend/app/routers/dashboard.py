from fastapi import APIRouter
from ..models.schemas import DashboardOverview, NetworkStatusSummary, TimelinePoint
from ..services.risk_engine import get_all_localities_summary, get_locality_detail
from ..services.forecast_service import get_network_status_summary, generate_city_timeline
from typing import List

router = APIRouter()

@router.get("/overview", response_model=DashboardOverview)
def get_dashboard_overview():
    localities = get_all_localities_summary()
    summary_data = get_network_status_summary()
    
    summary = NetworkStatusSummary(**summary_data)
    return DashboardOverview(summary=summary, localities=localities)

@router.get("/timeline", response_model=List[TimelinePoint])
def get_dashboard_timeline():
    return generate_city_timeline()

@router.get("/network-status")
def get_network_status():
    localities = get_all_localities_summary()
    res = []
    for loc in localities:
        detail = get_locality_detail(loc.id)
        res.append({
            "id": loc.id,
            "name": loc.name,
            "sensor_health": detail.sensor_health,
            "last_updated": detail.last_updated,
            "signal_strength": "Excellent" if detail.sensor_health == "ONLINE" else "Poor"
        })
    return res
