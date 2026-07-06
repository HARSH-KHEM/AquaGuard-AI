import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThreatMap from '../components/ThreatMap';

export default function ThreatMapPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="bg-[#020B18] text-[#dee3e9] min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center w-full px-8 py-4 z-50 backdrop-blur-md bg-[#020B18]/80 border-b border-white/10 sticky top-0">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
          <span className="text-headline-md font-headline-md font-bold tracking-tight text-on-surface">AquaGuard AI</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-label-caps text-label-caps" to="/">Dashboard</Link>
          <span className="text-primary font-bold border-b-2 border-primary pb-1 font-label-caps text-label-caps cursor-default">Threat Map</span>
          <Link className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-label-caps text-label-caps" to="/official" state={{ activeTab: 'timeline' }}>Analytics</Link>
          <Link className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-label-caps text-label-caps" to="/official" state={{ activeTab: 'forecast' }}>Reports</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/official" state={{ activeTab: 'assistant' }} className="hidden md:block bg-primary hover:bg-secondary text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
            Hydra AI
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden material-symbols-outlined text-on-surface">menu</button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full bg-[#020B18] border-b border-white/10 z-40 p-4 flex flex-col gap-4 shadow-xl">
          <Link onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant font-medium hover:text-on-surface transition-colors border-b border-white/5 pb-2" to="/">Dashboard</Link>
          <span className="text-primary font-bold border-b border-white/5 pb-2">Threat Map</span>
          <Link onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant font-medium hover:text-on-surface transition-colors border-b border-white/5 pb-2" to="/official" state={{ activeTab: 'timeline' }}>Analytics</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant font-medium hover:text-on-surface transition-colors border-b border-white/5 pb-2" to="/official" state={{ activeTab: 'forecast' }}>Reports</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/official" state={{ activeTab: 'assistant' }} className="text-white font-bold py-2 bg-primary rounded-xl text-center mt-2">Hydra AI</Link>
        </div>
      )}

      {/* Page Header */}
      <header className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[10px] font-bold text-[#ef4444] uppercase tracking-wider">Live Monitoring</span>
          </div>
        </div>
        <h1 className="text-headline-md font-headline-md font-bold text-white mb-1">Delhi-NCR Threat Map</h1>
        <p className="text-sm text-[#94A3B8]">Live contamination risk across 20 monitored localities — powered by 450+ sensor nodes</p>
      </header>

      {/* Map Container — fills remaining viewport */}
      <div className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden border border-white/10" style={{ height: 'calc(100vh - 200px)' }}>
        <ThreatMap />
      </div>
    </div>
  );
}
