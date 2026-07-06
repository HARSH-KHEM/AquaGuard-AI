from pydantic import BaseModel
from typing import List, Optional

class SensorReadings(BaseModel):
    ph: float
    turbidity: float
    chlorine: float
    ecoli: str

class PathogenData(BaseModel):
    name: str
    risk_level: str

class LocalitySummary(BaseModel):
    id: str
    name: str
    risk_score: int
    risk_level: str
    primary_disease_risk: str
    population: str
    lat: float
    lng: float

class NetworkStatusSummary(BaseModel):
    total_localities: int
    high_risk_count: int
    active_alerts: int
    online_sensors: int
    offline_sensors: int

class TimelinePoint(BaseModel):
    year: int
    risk: float

class HistoricalEvent(BaseModel):
    date: str
    location: str
    condition: str
    severity: str
    duration: str
    casualties: str

class LocalityDetail(LocalitySummary):
    sensors: SensorReadings
    disease_risks: List[PathogenData]
    historical_trend: List[float]
    forecast_trend: List[float]
    last_updated: str
    sensor_health: str

class DashboardOverview(BaseModel):
    summary: NetworkStatusSummary
    localities: List[LocalitySummary]

class ChatRequest(BaseModel):
    message: str
    locality_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    timestamp: str
