import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { getLocalities } from '../services/api';

const RISK_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MODERATE: '#eab308',
  STABLE: '#eab308',
  LOW: '#22c55e',
  SECURE: '#22c55e',
};

const RISK_ORDER = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];

function getRiskColor(riskLevel) {
  const key = riskLevel?.toUpperCase() || 'LOW';
  return RISK_COLORS[key] || RISK_COLORS.LOW;
}

function getMarkerRadius(riskScore) {
  // Scale radius from 6 (low risk) to 18 (critical)
  return Math.max(6, Math.min(18, 6 + (riskScore / 100) * 12));
}

function getRiskBadgeClasses(riskLevel) {
  const key = riskLevel?.toUpperCase() || 'LOW';
  switch (key) {
    case 'CRITICAL': return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30';
    case 'HIGH': return 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30';
    case 'MODERATE': return 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/30';
    default: return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30';
  }
}

// Legend component rendered inside the map container
function MapLegend() {
  const items = [
    { label: 'Critical', color: '#ef4444' },
    { label: 'High', color: '#f97316' },
    { label: 'Moderate', color: '#eab308' },
    { label: 'Low / Secure', color: '#22c55e' },
  ];

  return (
    <div className="absolute bottom-6 left-6 z-[1000] glass-card rounded-2xl p-4 min-w-[160px]"
         style={{ background: 'rgba(2, 11, 24, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-3">Risk Level</p>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full shrink-0 shadow-lg"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}60` }} />
            <span className="text-[12px] text-[#dee3e9] font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider">Radius = Risk Score</p>
      </div>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="w-full h-full bg-[#020B18] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <span className="material-symbols-outlined text-primary text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          public
        </span>
      </div>
      <div className="text-center">
        <p className="text-[#dee3e9] font-bold text-sm">Loading Threat Data</p>
        <p className="text-[#94A3B8] text-xs mt-1">Connecting to sensor network…</p>
      </div>
    </div>
  );
}

// Error display
function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="w-full h-full bg-[#020B18] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-[#ef4444] text-3xl">error</span>
      </div>
      <div className="text-center max-w-sm">
        <p className="text-[#dee3e9] font-bold text-sm">Connection Failed</p>
        <p className="text-[#94A3B8] text-xs mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-primary/10 border border-primary/30 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-base">refresh</span>
        Retry Connection
      </button>
    </div>
  );
}

// Inner component to force Leaflet to recalculate size after mount
function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    // Small delay to let the DOM settle
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function ThreatMap() {
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocalities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLocalities();
      setLocalities(data);
    } catch (err) {
      console.error('Failed to fetch localities:', err);
      setError('Unable to reach AquaGuard backend. Make sure the server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalities();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchLocalities} />;

  return (
    <div className="relative w-full" style={{ height: '100%' }}>
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: '100%', height: 'calc(100vh - 210px)' }}
        zoomControl={true}
      >
        <ResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {localities.map((loc) => {
          const color = getRiskColor(loc.risk_level);
          const radius = getMarkerRadius(loc.risk_score);
          return (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lng]}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.35,
                weight: 2,
                opacity: 0.8,
              }}
            >
              <Popup>
                <div style={{
                  background: '#0a1628',
                  color: '#dee3e9',
                  padding: '16px',
                  borderRadius: '12px',
                  minWidth: '200px',
                  fontFamily: 'Inter, sans-serif',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0', color: '#fff' }}>
                    {loc.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: color,
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                    }}>
                      {loc.risk_level}
                    </span>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: color, fontWeight: '600' }}>
                      {loc.risk_score}/100
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Disease Risk</span>
                      <span style={{ color: '#dee3e9', fontWeight: '500' }}>{loc.primary_disease_risk}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Affected Pop.</span>
                      <span style={{ color: '#dee3e9', fontWeight: '500' }}>{loc.population || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <MapLegend />

      {/* Stats overlay top-right */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        {RISK_ORDER.map(level => {
          const count = localities.filter(l => l.risk_level?.toUpperCase() === level).length;
          if (count === 0) return null;
          const color = RISK_COLORS[level];
          return (
            <div key={level}
                 className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                 style={{ background: 'rgba(2,11,24,0.85)', border: `1px solid ${color}40`, color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {count} {level}
            </div>
          );
        })}
      </div>
    </div>
  );
}
