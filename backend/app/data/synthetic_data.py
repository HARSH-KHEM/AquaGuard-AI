import random
from datetime import datetime, timedelta

def get_risk_level_and_disease(score):
    if score >= 80:
        return "CRITICAL", "Cholera"
    elif score >= 60:
        return "HIGH", "Typhoid"
    elif score >= 40:
        return "MODERATE", "Acute Diarrhea"
    else:
        return "LOW", "Hepatitis A"

def generate_sensor_readings(score, seed):
    random.seed(seed)
    
    # Base expected values based on risk score
    # High score -> High turb, low chlorine, high ecoli, abnormal pH
    
    turbidity = max(0.1, random.gauss(score / 15.0, 1.0))
    chlorine = max(0.0, random.gauss(1.5 - (score / 100.0), 0.2))
    
    if score > 70:
        ph = random.choice([random.gauss(9.0, 0.5), random.gauss(5.5, 0.5)])
        ecoli = "Present"
    elif score > 40:
        ph = random.gauss(8.0, 0.3)
        ecoli = "Trace"
    else:
        ph = random.gauss(7.2, 0.2)
        ecoli = "Absent"
        
    return {
        "ph": round(ph, 1),
        "turbidity": round(turbidity, 1),
        "chlorine": round(chlorine, 2),
        "ecoli": ecoli
    }

def generate_historical_trends(score, seed):
    random.seed(seed)
    trend = []
    # 14 days historical
    current_val = score
    for i in range(14):
        trend.append(max(0, min(100, round(current_val))))
        # walk backwards
        current_val -= random.gauss(0, 5)
    return list(reversed(trend))

def generate_forecast_trends(score, seed):
    random.seed(seed + 1000)
    trend = []
    # 7 days forecast
    current_val = score
    for i in range(7):
        trend.append(max(0, min(100, round(current_val))))
        current_val += random.gauss(score / 100 * 2, 4) # slight upward drift if already high
    return trend
