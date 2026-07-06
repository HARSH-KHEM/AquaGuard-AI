import random
from ..models.schemas import TimelinePoint
from .risk_engine import CACHED_LOCALITIES_SUMMARY

def generate_city_timeline():
    # Base city timeline logic
    # We'll create a synthetic aggregate risk for the past 6 years + current
    base_years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
    random.seed(42) # Stable seed for the overall city trend
    
    timeline = []
    for y in base_years:
        timeline.append(TimelinePoint(
            year=y,
            risk=random.uniform(25, 65)
        ))
        
    return timeline

def get_network_status_summary():
    total = len(CACHED_LOCALITIES_SUMMARY)
    high_risk = sum(1 for l in CACHED_LOCALITIES_SUMMARY if l.risk_score >= 60)
    alerts = sum(1 for l in CACHED_LOCALITIES_SUMMARY if l.risk_score >= 80)
    
    return {
        "total_localities": total,
        "high_risk_count": high_risk,
        "active_alerts": alerts,
        "online_sensors": total * 15 - (alerts * 2), # synthetic node calculation
        "offline_sensors": alerts * 2
    }
