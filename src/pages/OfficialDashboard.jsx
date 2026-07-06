import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sendChatMessage } from '../services/api';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  Map, Table2, MessageSquare, Activity, Settings as SettingsIcon, 
  Filter, X, MapPin, FileText, History, BellRing, RefreshCw, AlertCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import { localities } from '../data/mockData';

const risks = [
  { label: "CRITICAL", color: "#ffb4ab", bg: "bg-error/10", text: "text-error" },
  { label: "HIGH", color: "#ffb86e", bg: "bg-tertiary/10", text: "text-tertiary" },
  { label: "STABLE", color: "#89ceff", bg: "bg-primary/10", text: "text-primary" },
  { label: "SECURE", color: "#4cd7f6", bg: "bg-secondary/10", text: "text-secondary" }
];

const timelineData = [
  { year: 2020, risk: 25 },
  { year: 2021, risk: 40 },
  { year: 2022, risk: 30 },
  { year: 2023, risk: 60 },
  { year: 2024, risk: 35 },
  { year: 2025, risk: 55 },
  { year: 2026, risk: 45 },
];

const chatHistoryInitial = [
  { role: 'assistant', content: "Greetings, Supervisor. I'm monitoring 20 Delhi localities in real-time across 450+ sensor nodes. Analysis of the Delhi Sector-4 pipelines shows a 24% increase in contaminant pressure. How can I help you today?", time: 'Just now' }
];

const OfficialDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  const [drilldownLocality, setDrilldownLocality] = useState(null);
  const [chatHistory, setChatHistory] = useState(chatHistoryInitial);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedLocalityId, setSelectedLocalityId] = useState(null);
  const chatEndRef = useRef(null);

  const { currentUser, profile, profileComplete } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [complaintsList, setComplaintsList] = useState([]);
  const [isComplaintsLoading, setIsComplaintsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'complaints') {
      const fetchAllComplaints = async () => {
        setIsComplaintsLoading(true);
        try {
          const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setComplaintsList(data);
        } catch (err) {
          console.error("Error fetching all complaints:", err);
        } finally {
          setIsComplaintsLoading(false);
        }
      };
      fetchAllComplaints();
    }
  }, [activeTab]);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const complaintRef = doc(db, 'complaints', complaintId);
      await updateDoc(complaintRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      setComplaintsList(prev => prev.map(c => c.id === complaintId ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error("Error updating complaint status:", err);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
      setIsLoggingOut(false);
    }
  };

  const titles = {
    'overview': 'Intelligence Overview',
    'forecast': 'Network Status Monitor',
    'assistant': 'Hydra AI Assistant',
    'timeline': 'Outbreak Event Timeline',
    'settings': 'System Parameters',
    'complaints': 'Citizen Complaints'
  };

  const openDrilldown = (name) => {
    setDrilldownLocality(name);
    const loc = localities.find(l => l.name === name);
    if (loc) setSelectedLocalityId(loc.id);
  };

  const closeDrilldown = () => {
    setDrilldownLocality(null);
  };

  const handleSendChat = async (text) => {
    const message = text || chatInput;
    if (!message.trim() || isChatLoading) return;

    setChatHistory(prev => [...prev, { role: 'user', content: message, time: 'Just now' }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const data = await sendChatMessage(message, selectedLocalityId);
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply, time: 'Just now' }]);
    } catch (error) {
      console.error('Chat API error:', error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Unable to reach AI assistant, please try again.', time: 'Just now', isError: true }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'assistant' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  return (
    <div className="dark h-screen flex bg-[#020B18] text-[#dee3e9] font-body-sm overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[280px] h-screen fixed left-0 top-0 bg-surface-container border-r border-white/10 flex flex-col py-xl z-50">
        <div className="px-8 mb-10">
          <Link to="/" className="text-headline-md font-headline-md font-black text-primary tracking-tight">AquaGuard AI</Link>
          <p className="text-label-caps font-label-caps text-on-surface-variant mt-1 uppercase tracking-widest opacity-60">Command Center</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button 
            className={`flex items-center gap-3 px-6 py-4 w-full transition-all duration-200 ${activeTab === 'overview' ? 'active-nav' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('overview')}
          >
            <Map className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">Intelligence</span>
          </button>
          <button 
            className={`flex items-center gap-3 px-6 py-4 w-full transition-all duration-200 ${activeTab === 'forecast' ? 'active-nav' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('forecast')}
          >
            <Table2 className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">Network Status</span>
          </button>
          <button 
            className={`flex items-center gap-3 px-6 py-4 w-full transition-all duration-200 ${activeTab === 'assistant' ? 'active-nav' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('assistant')}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">AI Assistant</span>
          </button>
          <button 
            className={`flex items-center gap-3 px-6 py-4 w-full transition-all duration-200 ${activeTab === 'timeline' ? 'active-nav' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Activity className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">Outbreak Timeline</span>
          </button>
          <button 
            className={`flex items-center gap-3 px-6 py-4 w-full transition-all duration-200 ${activeTab === 'settings' ? 'active-nav' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">Settings</span>
          </button>
          <button 
            className={`flex items-center gap-3 px-6 py-4 w-full transition-all duration-200 ${activeTab === 'complaints' ? 'active-nav' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setActiveTab('complaints')}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">Complaints</span>
          </button>
        </nav>
        <div className="mt-auto px-6 space-y-4">
          <button className="w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="text-label-caps">New Assessment</span>
          </button>
          <div className="flex items-center gap-3 px-2 py-4 border-t border-white/5 mt-4">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden shrink-0">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-label-caps font-bold text-on-surface truncate">{profile?.name || currentUser?.email || 'Loading...'}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter truncate">{profile?.role || 'Official'}</p>
            </div>
            <button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="w-8 h-8 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors shrink-0"
              title="Log Out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-[280px] min-h-screen flex flex-col relative overflow-hidden">
        {/* TOP APP BAR */}
        <header className="sticky top-0 w-full px-margin-desktop py-6 z-40 bg-[#020B18]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-error-container/20 border border-error/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-error pulse-live"></span>
              <span className="text-label-caps font-bold text-error">LIVE THREAT MONITOR</span>
            </div>
            <h2 className="text-headline-sm font-headline-sm text-on-surface">{titles[activeTab]}</h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">search</span>
            <div className="relative">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
            </div>
            <button className="bg-primary-container/10 border border-primary/20 text-primary px-4 py-1.5 rounded-lg text-label-caps font-bold hover:bg-primary-container/20 transition-all">
              Hydra AI
            </button>
          </div>
        </header>

        {/* CONTENT VIEWS */}
        <div className="flex-1 p-margin-desktop space-y-gutter overflow-y-auto custom-scrollbar">
          
          {/* Profile Completion Banner */}
          {!profileComplete && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <div>
                  <p className="text-body-sm text-on-surface font-bold">Your profile is incomplete</p>
                  <p className="text-body-sm text-on-surface-variant">Please complete your profile to enable all Command Center features.</p>
                </div>
              </div>
              <Link to="/create-profile" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-sm hover:brightness-110 transition-all text-center whitespace-nowrap">
                Complete Profile
              </Link>
            </div>
          )}
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                <div className="glass-card rounded-xl p-lg flex flex-col">
                  <span className="text-label-caps text-on-surface-variant mb-2">Critical Zones</span>
                  <div className="flex items-end justify-between">
                    <span className="text-display-lg font-display-lg text-error">04</span>
                    <span className="text-error bg-error/10 px-2 py-0.5 rounded text-[12px] font-bold">+12%</span>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-lg flex flex-col">
                  <span className="text-label-caps text-on-surface-variant mb-2">High Risk Zones</span>
                  <div className="flex items-end justify-between">
                    <span className="text-display-lg font-display-lg text-tertiary">07</span>
                    <span className="text-tertiary bg-tertiary/10 px-2 py-0.5 rounded text-[12px] font-bold">Stable</span>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-lg flex flex-col">
                  <span className="text-label-caps text-on-surface-variant mb-2">Localities Monitored</span>
                  <div className="flex items-end justify-between">
                    <span className="text-display-lg font-display-lg text-primary">20</span>
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-[12px] font-bold">100%</span>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-lg flex flex-col">
                  <span className="text-label-caps text-on-surface-variant mb-2">Active Alerts</span>
                  <div className="flex items-end justify-between">
                    <span className="text-display-lg font-display-lg text-secondary">31</span>
                    <span className="text-secondary bg-secondary/10 px-2 py-0.5 rounded text-[12px] font-bold">-4%</span>
                  </div>
                </div>
              </div>

              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-headline-sm font-headline-sm">Delhi Regional Risk Map</h3>
                  <div className="flex bg-surface-container rounded-lg p-1 border border-white/5">
                    <button className="px-4 py-1.5 rounded-md text-label-caps font-bold bg-primary text-on-primary">Risk View</button>
                    <button className="px-4 py-1.5 rounded-md text-label-caps font-medium text-on-surface-variant hover:text-on-surface ml-1">Pipeline Age</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {localities.map((loc, i) => {
                    const r = loc.currentRisk > 80 ? risks[0] : loc.currentRisk > 50 ? risks[1] : loc.currentRisk > 20 ? risks[2] : risks[3];
                    return (
                      <div 
                        key={loc.id}
                        className="glass-card group cursor-pointer rounded-xl p-md border-l-4 border-l-transparent hover:border-l-current"
                        style={{ borderLeftColor: r.color }}
                        onClick={() => openDrilldown(loc.name)}
                      >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-bold ${r.text} tracking-widest`}>{r.label}</span>
                            <span className="material-symbols-outlined text-[18px] opacity-40 group-hover:opacity-100 transition-opacity">open_in_new</span>
                        </div>
                        <h4 className="text-body-md font-bold mb-1">{loc.name}</h4>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-3">
                            <div className="h-full" style={{ width: `${loc.currentRisk}%`, backgroundColor: r.color }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* TAB: FORECAST TABLE */}
          {activeTab === 'forecast' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-1/3">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input className="w-full bg-surface-container border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="Filter localities..." type="text"/>
                </div>
                <button className="flex items-center gap-2 text-label-caps bg-surface-container border border-white/10 px-4 py-2 rounded-xl hover:bg-surface-variant transition-colors">
                  <Filter className="w-4 h-4" /> Advanced Filters
                </button>
              </div>
              
              <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 text-label-caps text-on-surface-variant font-bold">Locality</th>
                      <th className="p-4 text-label-caps text-on-surface-variant font-bold">Risk Score</th>
                      <th className="p-4 text-label-caps text-on-surface-variant font-bold">Risk Level</th>
                      <th className="p-4 text-label-caps text-on-surface-variant font-bold">7-Day Trend</th>
                      <th className="p-4 text-label-caps text-on-surface-variant font-bold">Pipeline Age</th>
                      <th className="p-4 text-label-caps text-on-surface-variant font-bold">Last Outbreak</th>
                      <th className="p-4 text-label-caps text-on-surface-variant font-bold">Recommended Action</th>
                      <th className="p-4 text-label-caps text-on-surface-variant font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {localities.map((loc, i) => {
                      const r = loc.currentRisk > 80 ? risks[0] : loc.currentRisk > 50 ? risks[1] : loc.currentRisk > 20 ? risks[2] : risks[3];
                      return (
                        <tr key={loc.id} className="hover:bg-white/2 cursor-pointer transition-colors" onClick={() => openDrilldown(loc.name)}>
                          <td className="p-4 font-bold text-body-sm">{loc.name}</td>
                          <td className={`p-4 text-body-sm font-mono ${r.text}`}>{loc.currentRisk}/100</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${r.bg} ${r.text}`}>{r.label}</span>
                          </td>
                          <td className="p-4">
                            <svg className="w-24 h-6" viewBox="0 0 100 20">
                              <path className="sparkline" d="M0,10 L10,8 L20,12 L30,5 L40,15 L50,10 L60,18 L70,8 L80,12 L90,5 L100,10" style={{ stroke: r.color }}></path>
                            </svg>
                          </td>
                          <td className="p-4 text-body-sm text-on-surface-variant">{12 + (i % 8)}Y</td>
                          <td className="p-4 text-body-sm text-on-surface-variant">{['None', 'Aug 24', 'May 23', 'Oct 24'][i%4]}</td>
                          <td className="p-4 text-body-sm italic">{['Flush Lines', 'Inspect Main', 'Routine Check', 'None'][loc.currentRisk > 80 ? 0 : loc.currentRisk > 50 ? 1 : loc.currentRisk > 20 ? 2 : 3]}</td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={loc.currentRisk > 50} />
                              <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ASSISTANT */}
          {activeTab === 'assistant' && (
            <div className="h-[calc(100vh-200px)] flex flex-col max-w-4xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Hydra AI Assistant</h3>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Powered by Gemini Pro</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[10px] font-bold text-primary">REAL-TIME SYNC</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-surface-container/30 rounded-3xl border border-white/5 mb-6">
                <div className="space-y-6">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-surface-variant' : 'bg-primary-container'}`}>
                        {msg.role === 'user' ? <span className="material-symbols-outlined text-on-surface">person</span> : <span className="material-symbols-outlined text-on-primary">smart_toy</span>}
                      </div>
                      <div className={`glass-card p-lg rounded-2xl max-w-[85%] ${msg.role === 'user' ? 'bg-white/10 rounded-tr-none' : 'rounded-tl-none'}`}>
                        <p className="text-body-md leading-relaxed">{msg.content}</p>
                        <p className={`text-[11px] text-on-surface-variant mt-3 uppercase font-bold ${msg.role === 'user' ? 'text-right' : ''}`}>
                          {msg.role === 'assistant' ? 'Hydra v4.2 • ' : ''}{msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary-container">
                        <span className="material-symbols-outlined text-on-primary">smart_toy</span>
                      </div>
                      <div className="glass-card p-lg rounded-2xl rounded-tl-none">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          <span className="text-[11px] text-on-surface-variant ml-2 uppercase font-bold">Hydra is thinking…</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 px-2">
                  <button onClick={() => handleSendChat("Which areas need tanker deployment today?")} className="px-4 py-2 bg-surface-container border border-white/10 rounded-full text-[13px] hover:bg-surface-variant transition-all text-on-surface-variant">"Which areas need tanker deployment today?"</button>
                  <button onClick={() => handleSendChat("Highest risk zone this week?")} className="px-4 py-2 bg-surface-container border border-white/10 rounded-full text-[13px] hover:bg-surface-variant transition-all text-on-surface-variant">"Highest risk zone this week?"</button>
                </div>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 pr-16 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-50" 
                    placeholder={isChatLoading ? "Waiting for response..." : "Ask Hydra about water security or predictive trends..."}
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    disabled={isChatLoading}
                  />
                  <button onClick={() => handleSendChat()} disabled={isChatLoading} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined">{isChatLoading ? 'hourglass_top' : 'send'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-card p-xl rounded-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-headline-sm font-headline-sm">Predictive Risk vs Outbreak Events</h3>
                    <p className="text-body-sm text-on-surface-variant">Delhi City aggregate risk score mapped against historical disease incidents (2020-2026).</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(137,206,255,0.6)]"></span>
                      <span className="text-label-caps font-bold">Predictive Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-error"></span>
                      <span className="text-label-caps font-bold">Outbreak Event</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-[350px] mb-6 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#89ceff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#89ceff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip contentStyle={{ backgroundColor: '#020B18', borderColor: '#334155' }} />
                      <XAxis dataKey="year" stroke="#64748B" />
                      
                      <ReferenceLine x={2021} stroke="#ffb4ab" strokeDasharray="4" label={{ position: 'top', value: 'CHO', fill: '#ffb4ab', fontSize: 10 }} />
                      <ReferenceLine x={2023} stroke="#ffb4ab" strokeDasharray="4" label={{ position: 'top', value: 'TYP', fill: '#ffb4ab', fontSize: 10 }} />
                      <ReferenceLine x={2024} stroke="#ffb4ab" strokeDasharray="4" label={{ position: 'top', value: 'HEP', fill: '#ffb4ab', fontSize: 10 }} />
                      <ReferenceLine x={2025} stroke="#ffb4ab" strokeDasharray="4" label={{ position: 'top', value: 'DIA', fill: '#ffb4ab', fontSize: 10 }} />
                      
                      <Area type="monotone" dataKey="risk" stroke="#89ceff" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-lg border-b border-white/10 bg-white/5">
                  <h3 className="text-title-lg font-bold">Historical Events Ledger</h3>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-white/10 text-label-sm font-label-caps uppercase text-on-surface-variant">
                      <th className="p-4 pl-lg">Event Year</th>
                      <th className="p-4">Primary Pathogen</th>
                      <th className="p-4">Cases Reported</th>
                      <th className="p-4">Containment Duration</th>
                      <th className="p-4">Hydra AI Retro-Analysis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-body-md">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-lg font-bold">2021</td>
                      <td className="p-4 text-error font-bold flex items-center gap-2"><span className="material-symbols-outlined">warning</span> Vibrio cholerae</td>
                      <td className="p-4">1,245</td>
                      <td className="p-4">14 days</td>
                      <td className="p-4 text-on-surface-variant max-w-md truncate">Could have been contained in 3 days with dynamic rerouting.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-lg font-bold">2023</td>
                      <td className="p-4 text-tertiary font-bold">Salmonella Typhi</td>
                      <td className="p-4">830</td>
                      <td className="p-4">9 days</td>
                      <td className="p-4 text-on-surface-variant max-w-md truncate">Early warning missed due to sensor latency in Sector 7.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-lg font-bold">2024</td>
                      <td className="p-4 text-error font-bold">Hepatitis A</td>
                      <td className="p-4">2,100</td>
                      <td className="p-4">21 days</td>
                      <td className="p-4 text-on-surface-variant max-w-md truncate">Major contamination event. AI predictive accuracy would have been 89%.</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-lg font-bold">2025</td>
                      <td className="p-4 text-tertiary font-bold">Rotavirus</td>
                      <td className="p-4">540</td>
                      <td className="p-4">5 days</td>
                      <td className="p-4 text-on-surface-variant max-w-md truncate">Rapid containment achieved via manual valve shutdowns.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* TAB: COMPLAINTS */}
          {activeTab === 'complaints' && (
            <div className="space-y-6 animate-fade-in">
              {isComplaintsLoading ? (
                <div className="flex justify-center py-20">
                  <span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                </div>
              ) : complaintsList.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center border border-white/10">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 opacity-50">inbox</span>
                  <h3 className="text-title-lg font-bold text-on-surface mb-2">No Complaints</h3>
                  <p className="text-body-md text-on-surface-variant">There are no citizen complaints to review at this time.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {complaintsList.map(complaint => (
                    <div key={complaint.id} className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row gap-6">
                      {complaint.photoURL && (
                        <div className="w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-surface-container cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.open(complaint.photoURL, '_blank')}>
                          <img src={complaint.photoURL} alt="Complaint" className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2 gap-4">
                            <div>
                              <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2">
                                {complaint.issueType}
                              </h3>
                              <div className="flex items-center gap-2 text-on-surface-variant mt-1 mb-3">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span className="text-label-sm font-bold uppercase tracking-wider">{complaint.area}</span>
                                <span className="mx-2">•</span>
                                <span className="material-symbols-outlined text-[16px]">person</span>
                                <span className="text-label-sm font-bold uppercase tracking-wider">{complaint.name} ({complaint.phone})</span>
                              </div>
                            </div>
                            <div className="shrink-0">
                              <select 
                                value={complaint.status} 
                                onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                                className={`text-[12px] font-bold px-3 py-1.5 rounded-full border outline-none appearance-none cursor-pointer ${
                                  complaint.status === 'Resolved' ? 'bg-secondary/20 text-secondary border-secondary/30' : 
                                  complaint.status === 'In Progress' ? 'bg-tertiary/20 text-tertiary border-tertiary/30' : 
                                  'bg-error/20 text-error border-error/30'
                                }`}
                              >
                                <option value="Pending" className="bg-background text-on-surface">Pending</option>
                                <option value="In Progress" className="bg-background text-on-surface">In Progress</option>
                                <option value="Resolved" className="bg-background text-on-surface">Resolved</option>
                              </select>
                            </div>
                          </div>
                          
                          <p className="text-body-md text-on-surface-variant">{complaint.description}</p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-label-sm text-on-surface-variant/70">
                          <span>ID: {complaint.id.slice(0, 8).toUpperCase()}</span>
                          <span>Reported: {complaint.createdAt?.toDate ? complaint.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-8 pb-10 animate-fade-in">
              <div className="glass-card p-xl rounded-3xl space-y-10">
                <section className="space-y-6">
                  <h3 className="text-headline-sm font-headline-sm flex items-center gap-2">
                    <BellRing className="w-6 h-6 text-primary" />
                    Alert Thresholds
                  </h3>
                  <div className="space-y-8 px-2">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-body-md font-bold text-on-surface">Critical Risk Sensitivity</label>
                        <span className="bg-error/10 text-error px-3 py-1 rounded-lg font-mono font-bold">82%</span>
                      </div>
                      <input className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-error" type="range" defaultValue="82"/>
                      <p className="text-[12px] text-on-surface-variant leading-relaxed">Higher sensitivity triggers immediate multi-agency response protocols for lower variance spikes in E.coli detection.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-body-md font-bold text-on-surface">General Warning Threshold</label>
                        <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-lg font-mono font-bold">45%</span>
                      </div>
                      <input className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-tertiary" type="range" defaultValue="45"/>
                    </div>
                  </div>
                </section>
                
                <section className="space-y-6 pt-10 border-t border-white/5">
                  <h3 className="text-headline-sm font-headline-sm flex items-center gap-2">
                    <RefreshCw className="w-6 h-6 text-primary" />
                    System Controls
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center p-lg bg-surface-container/50 rounded-2xl border border-white/5">
                      <div>
                        <p className="font-bold">Real-time Data Stream</p>
                        <p className="text-[12px] text-on-surface-variant">Update dashboard every 15 seconds</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" type="checkbox"/>
                        <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center p-lg bg-surface-container/50 rounded-2xl border border-white/5">
                      <div>
                        <p className="font-bold">Hydra Autonomic Response</p>
                        <p className="text-[12px] text-on-surface-variant">Allow AI to auto-route tanker water during Critical alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input className="sr-only peer" type="checkbox"/>
                        <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </section>
                
                <div className="pt-10 flex gap-4">
                  <button className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-bold hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 transition-all">Save Changes</button>
                  <button className="flex-1 py-4 bg-white/5 text-on-surface rounded-2xl font-bold hover:bg-white/10 transition-all">Export Settings Log</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DRILLDOWN SLIDE-IN PANEL */}
        <aside className={`drilldown-panel fixed right-0 top-0 h-screen w-[450px] bg-surface-container border-l border-white/10 z-[60] flex flex-col shadow-2xl ${drilldownLocality ? '' : 'hidden-panel'}`}>
          <div className="p-8 border-b border-white/5 flex justify-between items-start">
            <div>
              <h3 className="text-headline-md font-bold text-primary">{drilldownLocality}</h3>
              <p className="text-label-caps text-on-surface-variant flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3" /> Zone Monitoring Station
              </p>
            </div>
            <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors" onClick={closeDrilldown}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex border-b border-white/5">
            <button className="flex-1 py-4 text-label-caps font-bold text-primary border-b-2 border-primary">Sensors</button>
            <button className="flex-1 py-4 text-label-caps font-bold text-on-surface-variant hover:text-on-surface transition-colors">Risk Trend</button>
            <button className="flex-1 py-4 text-label-caps font-bold text-on-surface-variant hover:text-on-surface transition-colors">Rainfall</button>
            <button className="flex-1 py-4 text-label-caps font-bold text-on-surface-variant hover:text-on-surface transition-colors">Actions</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">pH Level</span>
                <p className="text-xl font-bold text-primary">7.2</p>
                <svg className="w-full h-10" viewBox="0 0 100 20">
                  <path d="M0,10 Q25,5 50,15 T100,5" fill="none" stroke="#89ceff" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div className="glass-card p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Turbidity</span>
                <p className="text-xl font-bold text-tertiary">0.8 NTU</p>
                <svg className="w-full h-10" viewBox="0 0 100 20">
                  <path d="M0,15 Q25,18 50,8 T100,12" fill="none" stroke="#ffb86e" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div className="glass-card p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Chlorine</span>
                <p className="text-xl font-bold text-secondary">1.2 mg/L</p>
                <svg className="w-full h-10" viewBox="0 0 100 20">
                  <path d="M0,5 Q25,12 50,5 T100,15" fill="none" stroke="#4cd7f6" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div className="glass-card p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">E.coli Count</span>
                <p className="text-xl font-bold text-error">Pos (2)</p>
                <svg className="w-full h-10" viewBox="0 0 100 20">
                  <path d="M0,18 Q25,5 50,12 T100,5" fill="none" stroke="#ffb4ab" strokeWidth="1.5"></path>
                </svg>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-label-caps font-bold">Priority Response Checklist</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 bg-surface-container-highest/30 rounded-xl cursor-pointer hover:bg-surface-container-highest/50 transition-colors border border-white/5">
                  <input className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-offset-surface-container focus:ring-primary" type="checkbox"/>
                  <span className="text-body-sm">Schedule immediate pipe scouring</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-surface-container-highest/30 rounded-xl cursor-pointer hover:bg-surface-container-highest/50 transition-colors border border-white/5">
                  <input defaultChecked className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-offset-surface-container focus:ring-primary" type="checkbox"/>
                  <span className="text-body-sm">Pre-position ORS at Saket Hospital</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-surface-container-highest/30 rounded-xl cursor-pointer hover:bg-surface-container-highest/50 transition-colors border border-white/5">
                  <input className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-offset-surface-container focus:ring-primary" type="checkbox"/>
                  <span className="text-body-sm">SMS Alert Broadcast to resident RWA</span>
                </label>
              </div>
            </div>
            
            <button className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Generate Full Technical Report
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default OfficialDashboard;
