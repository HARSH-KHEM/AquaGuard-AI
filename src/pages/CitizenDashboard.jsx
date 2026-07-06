import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { riskTrendData, localities } from '../data/mockData';

const CitizenDashboard = () => {
  const [selectedLocality, setSelectedLocality] = useState("Rohini");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [riskScore, setRiskScore] = useState(48);
  const [sensors, setSensors] = useState({
    pH: 9.2, turbidity: 5.8, chlorine: 0.4, ecoli: 'Present',
    phWidth: 85, turbWidth: 92, chlorWidth: 40, ecoliWidth: 100,
    cholera: 'CRITICAL', typhoid: 'WARNING', diarrhea: 'MODERATE', hep: 'LOW RISK',
    chartData: riskTrendData
  });

  useEffect(() => {
    // Simulate fetching data for the locality
    const generateScore = () => {
      if (selectedLocality === "Rohini") return 48;
      const base = localities.find(l => l.name === selectedLocality)?.currentRisk;
      return base || (Math.floor(Math.random() * 80) + 15);
    };
    const s = generateScore();
    setRiskScore(s);

    const isHigh = s > 65;
    const isWarn = s > 40 && s <= 65;
    
    setSensors({
      pH: isHigh ? 9.5 : isWarn ? 8.2 : 7.2,
      turbidity: isHigh ? 8.8 : isWarn ? 5.8 : 2.1,
      chlorine: isHigh ? 0.1 : isWarn ? 0.4 : 1.2,
      ecoli: isHigh ? 'Present' : isWarn ? 'Trace' : 'Absent',
      phWidth: isHigh ? 95 : isWarn ? 85 : 40,
      turbWidth: isHigh ? 98 : isWarn ? 70 : 20,
      chlorWidth: isHigh ? 10 : isWarn ? 40 : 80,
      ecoliWidth: isHigh ? 100 : isWarn ? 50 : 0,
      cholera: isHigh ? 'CRITICAL' : isWarn ? 'WARNING' : 'LOW RISK',
      typhoid: isHigh ? 'CRITICAL' : isWarn ? 'WARNING' : 'LOW RISK',
      diarrhea: isHigh ? 'WARNING' : isWarn ? 'MODERATE' : 'LOW RISK',
      hep: isHigh ? 'MODERATE' : 'LOW RISK',
      chartData: riskTrendData.map(d => ({
        day: d.day,
        historical: typeof d.historical === 'number' ? Math.max(10, Math.min(100, Math.floor(d.historical + (s - 88) * 0.5))) : undefined,
        forecast: typeof d.forecast === 'number' ? Math.max(10, Math.min(100, Math.floor(d.forecast + (s - 88) * 0.5))) : undefined,
      }))
    });
  }, [selectedLocality]);

  const getRiskDetails = () => {
    if (riskScore < 40) {
      return {
        scoreClass: 'text-[120px] leading-none font-black text-sky-400 transition-colors duration-500',
        rippleClass: 'risk-ripple-container text-sky-400',
        bannerHidden: true,
        bannerClass: '',
        bannerText: '',
        statusIcon: 'check_circle',
        statusText: 'Status: EXCELLENT',
        statusContainerClass: 'flex items-center gap-3 mb-2 text-sky-400',
        desc: 'Water quality is within safe drinking limits. Regular monitoring continues.'
      };
    } else if (riskScore < 65) {
      return {
        scoreClass: 'text-[120px] leading-none font-black text-orange-500 transition-colors duration-500',
        rippleClass: 'risk-ripple-container text-orange-500',
        bannerHidden: false,
        bannerClass: 'bg-orange-500/15 text-orange-500 px-6 py-4 rounded-2xl flex items-center justify-between border border-orange-500/50 mb-6',
        bannerText: 'MODERATE RISK — Boiling water is recommended for sensitive groups.',
        statusIcon: 'warning',
        statusText: 'Status: WARNING',
        statusContainerClass: 'flex items-center gap-3 mb-2 text-orange-500',
        desc: 'Minor turbidity detected. Chlorine levels are within range but close to lower limits.'
      };
    } else {
      return {
        scoreClass: 'text-[120px] leading-none font-black text-red-500 transition-colors duration-500',
        rippleClass: 'risk-ripple-container text-red-500',
        bannerHidden: false,
        bannerClass: 'bg-red-500/15 text-red-500 px-6 py-4 rounded-2xl flex items-center justify-between border border-red-500/50 mb-6',
        bannerText: 'HIGH RISK ALERT — Boil all drinking water for at least 1 minute before use.',
        statusIcon: 'report',
        statusText: 'Health Advisory: HIGH RISK',
        statusContainerClass: 'flex items-center gap-3 mb-2 text-red-500',
        desc: 'Data indicates severe contamination. High levels of E.coli detected. Avoid consumption.'
      };
    }
  };

  const riskDetails = getRiskDetails();

  return (
    <div className="bg-[#020B18] min-h-screen text-[#94A3B8] font-body-sm">
      {/* TopNavBar */}
      <nav className="bg-[#020B18]/60 backdrop-blur-xl border-b border-white/10 docked full-width top-0 sticky z-50 flex justify-between items-center w-full px-margin-desktop py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-headline-md font-headline-md font-bold tracking-tight text-primary">AquaGuard AI</Link>
          <div className="hidden md:block h-6 w-[1px] bg-white/10 mx-2"></div>
          <p className="hidden md:block text-[#64748B] font-body-sm italic">Is your water safe today?</p>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/threat-map" className="hidden md:block hover:text-[#38BDF8] transition-colors">Risk Heatmap</Link>
          <Link to="/my-complaints" className="hidden md:block hover:text-[#38BDF8] transition-colors">Track Complaint</Link>
          <Link to="/report-issue" className="bg-[#EF4444]/10 text-[#EF4444] px-5 py-2.5 rounded-xl font-bold hover:bg-[#EF4444]/20 transition-all border border-[#EF4444]/20 hidden md:block">Report Issue</Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden material-symbols-outlined text-[#94A3B8]">menu</button>
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full p-1">
            <button className="px-5 py-1.5 text-label-caps font-semibold bg-primary text-white rounded-full transition-all duration-300">EN</button>
            <button className="px-5 py-1.5 text-label-caps font-semibold text-[#64748B] hover:text-[#F0F9FF] transition-all duration-300">हिंदी</button>
          </div>
          <div className="hidden md:flex w-10 h-10 rounded-full bg-primary/10 border border-primary/20 items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full bg-[#020B18] border-b border-white/10 z-40 p-4 flex flex-col gap-4 shadow-xl">
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/threat-map" className="text-[#94A3B8] font-bold border-b border-white/5 pb-2">Risk Heatmap</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/my-complaints" className="text-[#94A3B8] font-bold border-b border-white/5 pb-2">Track Complaint</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} to="/report-issue" className="text-[#EF4444] font-bold mt-2">Report Issue</Link>
        </div>
      )}

      {/* Content Wrapper */}
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl space-y-lg">
        {/* AlertBanner Component */}
        {!riskDetails.bannerHidden && (
          <div className={riskDetails.bannerClass}>
            <div className="flex items-center gap-4">
              <div className="pulse-dot"></div>
              <span className="font-bold tracking-wide text-body-md uppercase">{riskDetails.bannerText}</span>
            </div>
            <span className="material-symbols-outlined cursor-pointer" onClick={() => setRiskScore(30)}>close</span>
          </div>
        )}

        {/* Locality Selector */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-[#F0F9FF]">Community Dashboard</h1>
            <p className="text-[#94A3B8] font-body-md">Real-time water intelligence for your neighborhood.</p>
          </div>
          <div className="relative w-full md:w-80">
            <label className="absolute -top-2 left-3 px-1 bg-[#020B18] text-label-caps font-label-caps text-primary z-10">Select Locality</label>
            <select 
              className="w-full h-14 pl-4 pr-10 bg-[#041628] border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-[#F0F9FF]"
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
            >
              {localities.map(loc => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-[#64748B]">expand_more</span>
            </div>
          </div>
        </section>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Hero Risk Card */}
          <div className="lg:col-span-7 glass rounded-3xl p-xl flex flex-col justify-between relative overflow-hidden min-h-[420px]">
            {/* Ripple Animation */}
            <div className={riskDetails.rippleClass}>
              <div className="ripple"></div>
              <div className="ripple"></div>
              <div className="ripple"></div>
              <div className="ripple"></div>
            </div>
            <div className="relative z-10">
              <span className="text-label-caps font-label-caps text-[#64748B] uppercase tracking-widest block mb-2">Current Water Safety Index</span>
              <div className="flex items-baseline gap-2">
                <span className={riskDetails.scoreClass}>{riskScore}</span>
                <span className="text-headline-md font-headline-md text-[#64748B]">/100</span>
              </div>
            </div>
            <div className="relative z-10 mt-auto bg-black/20 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <div className={riskDetails.statusContainerClass}>
                <span className="material-symbols-outlined">{riskDetails.statusIcon}</span>
                <h3 className="font-headline-sm text-headline-sm text-[#F0F9FF]">{riskDetails.statusText}</h3>
              </div>
              <p className="font-body-md text-[#94A3B8]">{riskDetails.desc}</p>
            </div>
          </div>

          {/* Disease Risk Panel */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-sm">
            <div className="glass rounded-2xl p-lg flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-red-500">microbiology</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-[#F0F9FF] mb-3">Cholera</h4>
              <span className={`px-4 py-1.5 rounded-full text-white text-[11px] font-bold tracking-wider shadow-sm ${sensors.cholera === 'CRITICAL' ? 'bg-red-500' : sensors.cholera === 'WARNING' ? 'bg-orange-500' : 'bg-sky-500'}`}>{sensors.cholera}</span>
            </div>
            <div className="glass rounded-2xl p-lg flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-orange-500">healing</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-[#F0F9FF] mb-3">Typhoid</h4>
              <span className={`px-4 py-1.5 rounded-full text-white text-[11px] font-bold tracking-wider shadow-sm ${sensors.typhoid === 'CRITICAL' ? 'bg-red-500' : sensors.typhoid === 'WARNING' ? 'bg-orange-500' : 'bg-sky-500'}`}>{sensors.typhoid}</span>
            </div>
            <div className="glass rounded-2xl p-lg flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-sky-500">stack</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-[#F0F9FF] mb-3">Acute Diarrhea</h4>
              <span className={`px-4 py-1.5 rounded-full text-white text-[11px] font-bold tracking-wider shadow-sm ${sensors.diarrhea === 'WARNING' ? 'bg-orange-500' : 'bg-sky-500'}`}>{sensors.diarrhea}</span>
            </div>
            <div className="glass rounded-2xl p-lg flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-[#64748B]">clean_hands</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-[#F0F9FF] mb-3">Hepatitis A</h4>
              <span className="px-4 py-1.5 rounded-full bg-white/10 text-[#64748B] text-[11px] font-bold tracking-wider shadow-sm uppercase">{sensors.hep}</span>
            </div>
          </div>

          {/* Metrics Snapshot Row */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="glass rounded-3xl p-lg flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className="text-label-caps font-label-caps text-[#64748B] uppercase">pH Level</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${sensors.phWidth > 90 ? 'bg-red-500/20 text-red-500 border-red-500/30' : sensors.phWidth > 70 ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : 'bg-sky-500/20 text-sky-500 border-sky-500/30'}`}>{sensors.phWidth > 90 ? 'DANGER' : sensors.phWidth > 70 ? 'WARNING' : 'SAFE'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-headline-lg font-headline-lg text-[#F0F9FF]">{sensors.pH}</span>
                <span className="text-body-sm text-[#64748B]">Alkaline</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${sensors.phWidth > 90 ? 'bg-red-500' : sensors.phWidth > 70 ? 'bg-orange-500' : 'bg-sky-500'}`} style={{ width: `${sensors.phWidth}%` }}></div>
              </div>
            </div>
            <div className="glass rounded-3xl p-lg flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className="text-label-caps font-label-caps text-[#64748B] uppercase">Turbidity</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${sensors.turbWidth > 90 ? 'bg-red-500/20 text-red-500 border-red-500/30' : sensors.turbWidth > 70 ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : 'bg-sky-500/20 text-sky-500 border-sky-500/30'}`}>{sensors.turbWidth > 90 ? 'DANGER' : sensors.turbWidth > 70 ? 'WARNING' : 'SAFE'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-headline-lg font-headline-lg text-[#F0F9FF]">{sensors.turbidity}</span>
                <span className="text-body-sm text-[#64748B]">NTU</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${sensors.turbWidth > 90 ? 'bg-red-500' : sensors.turbWidth > 70 ? 'bg-orange-500' : 'bg-sky-500'}`} style={{ width: `${sensors.turbWidth}%` }}></div>
              </div>
            </div>
            <div className="glass rounded-3xl p-lg flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className="text-label-caps font-label-caps text-[#64748B] uppercase">Chlorine</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${sensors.chlorWidth > 90 ? 'bg-red-500/20 text-red-500 border-red-500/30' : sensors.chlorWidth > 70 ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : 'bg-sky-500/20 text-sky-500 border-sky-500/30'}`}>{sensors.chlorWidth > 90 ? 'DANGER' : sensors.chlorWidth > 70 ? 'WARNING' : 'SAFE'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-headline-lg font-headline-lg text-[#F0F9FF]">{sensors.chlorine}</span>
                <span className="text-body-sm text-[#64748B]">mg/L</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${sensors.chlorWidth > 90 ? 'bg-red-500' : sensors.chlorWidth > 70 ? 'bg-orange-500' : 'bg-sky-500'}`} style={{ width: `${sensors.chlorWidth}%` }}></div>
              </div>
            </div>
            <div className="glass rounded-3xl p-lg flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className="text-label-caps font-label-caps text-[#64748B] uppercase">E. coli</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${sensors.ecoliWidth > 90 ? 'bg-red-500/20 text-red-500 border-red-500/30' : sensors.ecoliWidth > 40 ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : 'bg-sky-500/20 text-sky-500 border-sky-500/30'}`}>{sensors.ecoliWidth > 90 ? 'DANGER' : sensors.ecoliWidth > 40 ? 'WARNING' : 'SAFE'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-headline-lg font-headline-lg text-[#F0F9FF]">{sensors.ecoli}</span>
                <span className="text-body-sm text-[#64748B]">{sensors.ecoli === 'Absent' ? 'Negative' : 'Positive'}</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${sensors.ecoliWidth > 90 ? 'bg-red-500' : sensors.ecoliWidth > 40 ? 'bg-orange-500' : 'bg-sky-500'}`} style={{ width: `${sensors.ecoliWidth}%` }}></div>
              </div>
            </div>
          </div>

          {/* Enhanced 21-Day Forecast Chart */}
          <div className="lg:col-span-12 glass rounded-3xl p-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-[#F0F9FF]">21-Day Safety Forecast</h3>
                <p className="text-body-sm text-[#94A3B8]">Historical trends vs predictive modeling for local water supply.</p>
              </div>
              <div className="flex items-center gap-6 text-label-caps font-semibold">
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-4 h-4 bg-primary/20 border border-primary rounded-sm"></div> Historical (14D)
                </div>
                <div className="flex items-center gap-2 text-orange-500">
                  <div className="w-4 h-4 border border-dashed border-orange-500 rounded-sm"></div> Forecast (7D)
                </div>
              </div>
            </div>
            
            <div className="w-full h-72 relative bg-transparent rounded-2xl p-6 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sensors.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#de8712" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#de8712" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020B18', borderColor: '#334155' }}
                    itemStyle={{ color: '#F0F9FF' }}
                  />
                  <ReferenceLine x="Today" stroke="#64748B" strokeDasharray="6 4" />
                  <ReferenceDot x="Today" y={88} r={6} fill="#0ea5e9" stroke="#fff" strokeWidth={2} />
                  
                  <Area type="monotone" dataKey="historical" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorHistorical)" />
                  <Area type="monotone" dataKey="forecast" stroke="#de8712" strokeWidth={4} strokeDasharray="10 8" fillOpacity={1} fill="url(#colorForecast)" />
                </AreaChart>
              </ResponsiveContainer>

              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-[10px] text-[#64748B] font-bold tracking-widest py-3 border-t border-white/5">
                <span>14 DAYS AGO</span>
                <span className="text-[#F0F9FF]">PRESENT DAY</span>
                <span>7 DAY FORECAST</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#020B18] border-t border-white/5 mt-2xl py-xl px-margin-desktop">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-xl">
          <div className="flex flex-col gap-2">
            <span className="text-headline-sm font-headline-sm text-primary">AquaGuard AI</span>
            <p className="text-body-sm text-[#94A3B8] max-w-sm">
                Utilizing predictive AI models and real-time sensor networks to ensure potable water for every citizen. Data sourced from Delhi Jal Board &amp; Community Ground Reports.
            </p>
          </div>
          <div className="flex items-center gap-gutter">
            <div className="text-right">
              <span className="block text-label-caps font-label-caps text-[#64748B] uppercase">Built for</span>
              <span className="block font-headline-sm text-[#F0F9FF]">Google Cloud Gen AI Academy Hackathon 2026 | Team HACK-X</span>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">water_drop</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-xl pt-lg flex flex-col md:flex-row justify-between text-label-caps font-label-caps text-[#64748B]">
          <p>© 2026 AquaGuard AI Intelligence Systems.</p>
          <div className="flex gap-lg mt-sm md:mt-0">
            <a className="hover:text-primary transition-colors" href="#">Data Transparency Policy</a>
            <a className="hover:text-primary transition-colors" href="#">API for Developers</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CitizenDashboard;
