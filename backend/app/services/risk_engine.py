from ..data.localities import LOCALITIES_LIST
from ..data.synthetic_data import get_risk_level_and_disease, generate_sensor_readings, generate_historical_trends, generate_forecast_trends
from ..models.schemas import LocalitySummary, LocalityDetail, PathogenData, SensorReadings
import random
from datetime import datetime

# Initialize and cache in memory to keep data stable across requests
CACHED_LOCALITIES_SUMMARY = []
CACHED_LOCALITIES_DETAIL = {}

def get_disease_risks(score):
    risks = []
    if score >= 80:
        risks.append(PathogenData(name="Cholera", risk_level="CRITICAL"))
        risks.append(PathogenData(name="Typhoid", risk_level="WARNING"))
        risks.append(PathogenData(name="Acute Diarrhea", risk_level="MODERATE"))
        risks.append(PathogenData(name="Hepatitis A", risk_level="LOW RISK"))
    elif score >= 60:
        risks.append(PathogenData(name="Cholera", risk_level="WARNING"))
        risks.append(PathogenData(name="Typhoid", risk_level="CRITICAL"))
        risks.append(PathogenData(name="Acute Diarrhea", risk_level="WARNING"))
        risks.append(PathogenData(name="Hepatitis A", risk_level="MODERATE"))
    elif score >= 40:
        risks.append(PathogenData(name="Cholera", risk_level="LOW RISK"))
        risks.append(PathogenData(name="Typhoid", risk_level="WARNING"))
        risks.append(PathogenData(name="Acute Diarrhea", risk_level="MODERATE"))
        risks.append(PathogenData(name="Hepatitis A", risk_level="LOW RISK"))
    else:
        risks.append(PathogenData(name="Cholera", risk_level="LOW RISK"))
        risks.append(PathogenData(name="Typhoid", risk_level="LOW RISK"))
        risks.append(PathogenData(name="Acute Diarrhea", risk_level="LOW RISK"))
        risks.append(PathogenData(name="Hepatitis A", risk_level="LOW RISK"))
    return risks

def init_cache():
    global CACHED_LOCALITIES_SUMMARY, CACHED_LOCALITIES_DETAIL
    
    for i, loc in enumerate(LOCALITIES_LIST):
        seed = int(loc["id"]) * 1000
        random.seed(seed)
        
        # Add a little jitter to base risk on startup
        jittered_risk = max(5, min(100, loc["base_risk"] + random.randint(-5, 5)))
        level, disease = get_risk_level_and_disease(jittered_risk)
        
        summary = LocalitySummary(
            id=loc["id"],
            name=loc["name"],
            risk_score=jittered_risk,
            risk_level=level,
            primary_disease_risk=disease,
            population=loc["population"],
            lat=loc["lat"],
            lng=loc["lng"]
        )
        CACHED_LOCALITIES_SUMMARY.append(summary)
        
        sensor_dict = generate_sensor_readings(jittered_risk, seed)
        sensors = SensorReadings(**sensor_dict)
        
        disease_risks = get_disease_risks(jittered_risk)
        historical = generate_historical_trends(jittered_risk, seed)
        forecast = generate_forecast_trends(jittered_risk, seed)
        
        detail = LocalityDetail(
            **summary.model_dump(),
            sensors=sensors,
            disease_risks=disease_risks,
            historical_trend=historical,
            forecast_trend=forecast,
            last_updated=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            sensor_health="ONLINE" if jittered_risk < 95 else random.choice(["ONLINE", "OFFLINE"])
        )
        CACHED_LOCALITIES_DETAIL[loc["id"]] = detail

# Initialize on module load
if not CACHED_LOCALITIES_SUMMARY:
    init_cache()

def get_all_localities_summary():
    return CACHED_LOCALITIES_SUMMARY

def get_locality_detail(locality_id: str):
    return CACHED_LOCALITIES_DETAIL.get(locality_id)
