import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const LandingPage = () => {
  const cardsRef = useRef([]);
  const { currentUser, profile, profileComplete } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    cardsRef.current.forEach(card => {
      if (card) {
        card.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
        observer.observe(card);
      }
    });

    return () => {
      cardsRef.current.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const handleStatMouseEnter = (e) => {
    e.currentTarget.style.textShadow = '0 0 25px rgba(14, 165, 233, 0.8)';
    e.currentTarget.style.transform = 'scale(1.1)';
  };

  const handleStatMouseLeave = (e) => {
    e.currentTarget.style.textShadow = 'none';
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <div className="bg-background text-on-surface-variant min-h-screen">
      {/* TopNavBar */}
      <nav className="flex justify-between items-center w-full px-margin-desktop py-4 z-50 backdrop-blur-md bg-background/80 border-b border-white/10 docked full-width top-0 sticky">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
          <span className="text-headline-md font-headline-md font-bold tracking-tight text-on-surface">AquaGuard AI</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-label-caps text-label-caps" to="/">Dashboard</Link>
          <Link className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-label-caps text-label-caps" to="/threat-map">Threat Map</Link>
          <Link className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-label-caps text-label-caps" to="/official" state={{ activeTab: 'timeline' }}>Analytics</Link>
          <Link className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-label-caps text-label-caps" to="/official" state={{ activeTab: 'forecast' }}>Reports</Link>
          {currentUser && (
            <>
              <Link className="text-secondary font-medium hover:text-on-surface transition-colors font-label-caps text-label-caps" to="/report-issue">Report Issue</Link>
              <Link className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-label-caps text-label-caps" to="/my-complaints">My Complaints</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!currentUser ? (
            <Link to="/login" className="hidden md:inline-block px-4 py-2 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all text-sm">Official Login</Link>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-3 mr-2">
                {profileComplete ? (
                  <Link to="/create-profile" className="flex items-center gap-2 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-white/10">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-primary/50" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
                      </div>
                    )}
                    <span className="text-sm font-bold text-on-surface">Welcome, {profile?.name}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-on-surface">Hello, User</span>
                    <Link to="/create-profile" className="text-sm font-bold text-primary hover:text-secondary underline transition-colors">Create Profile</Link>
                  </div>
                )}
              </div>
              <Link to="/official" className="bg-primary/20 text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/30 transition-all text-sm hidden md:inline-block">Command Center</Link>
              <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors px-2 py-2" title="Log Out">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </>
          )}
          <button className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">Hydra AI</button>
          <button className="md:hidden material-symbols-outlined text-on-surface">menu</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-32 text-center radial-glow overflow-hidden">
        <div className="container mx-auto px-margin-desktop z-10">
          {/* Floating Droplet Icon */}
          <div className="mb-12 inline-block">
            <span className="material-symbols-outlined text-[80px] text-primary animate-float text-glow" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          </div>
          <h1 className="font-display-lg text-display-lg md:text-[64px] text-on-surface mb-4 leading-tight">
            Don't wait for the outbreak.
          </h1>
          <h2 className="text-secondary italic font-headline-lg text-[48px] md:text-[56px] mb-8">
            Predict it.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
            Leveraging Google Cloud Gen AI and real-time aquatic sensors to provide precise 7-day disease forecasts for 20 high-risk Delhi localities.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link to="/citizen" className="w-full md:w-auto bg-on-surface text-background px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-all transform hover:-translate-y-1 inline-block">
              View Citizen Dashboard
            </Link>
            {!currentUser ? (
              <Link to="/login" className="w-full md:w-auto border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/10 transition-all transform hover:-translate-y-1 inline-flex items-center justify-center">
                Official Login <span className="ml-2">→</span>
              </Link>
            ) : (
              <Link to="/official" className="w-full md:w-auto border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/10 transition-all transform hover:-translate-y-1 inline-flex items-center justify-center">
                Command Center <span className="ml-2">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="container mx-auto px-margin-desktop mt-24 grid grid-cols-1 md:grid-cols-3 gap-gutter z-10">
          <div ref={el => cardsRef.current[0] = el} className="glass-card p-8 rounded-2xl flex flex-col items-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-4">location_on</span>
            <span 
              className="font-headline-lg text-on-surface inline-block transition-transform duration-300"
              onMouseEnter={handleStatMouseEnter}
              onMouseLeave={handleStatMouseLeave}
            >20</span>
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest mt-1">Localities Monitored</span>
          </div>
          <div ref={el => cardsRef.current[1] = el} className="glass-card p-8 rounded-2xl flex flex-col items-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-4">calendar_today</span>
            <span 
              className="font-headline-lg text-on-surface inline-block transition-transform duration-300"
              onMouseEnter={handleStatMouseEnter}
              onMouseLeave={handleStatMouseLeave}
            >7-Day</span>
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest mt-1">Forecast Window</span>
          </div>
          <div ref={el => cardsRef.current[2] = el} className="glass-card p-8 rounded-2xl flex flex-col items-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-4">pause</span>
            <span 
              className="font-headline-lg text-on-surface inline-block transition-transform duration-300"
              onMouseEnter={handleStatMouseEnter}
              onMouseLeave={handleStatMouseLeave}
            >4</span>
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest mt-1">Disease Signals Tracked</span>
          </div>
        </div>

        {/* Wave Animation */}
        <div className="wave-container">
          <svg className="wave-svg" preserveAspectRatio="none" viewBox="0 24 150 28">
            <defs>
              <path d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" id="gentle-wave"></path>
            </defs>
            <g className="wave-parallax">
              <use className="wave-path" opacity="0.7" x="48" href="#gentle-wave" y="0"></use>
              <use className="wave-path" opacity="0.5" x="48" href="#gentle-wave" y="3"></use>
              <use className="wave-path" opacity="0.3" x="48" href="#gentle-wave" y="5"></use>
              <use className="wave-path" x="48" href="#gentle-wave" y="7"></use>
            </g>
          </svg>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-margin-desktop">
          <div className="text-center mb-20">
            <span className="text-primary font-label-caps text-label-caps uppercase tracking-widest block mb-4">Technology Stack</span>
            <h2 className="font-headline-lg text-on-surface text-4xl">Precision Intelligence Flow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connectors for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0"></div>
            
            <div className="flex flex-col items-center text-center z-10 group">
              <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mb-6 border-white/10 group-hover:border-primary transition-all">
                <span className="material-symbols-outlined text-primary text-3xl">database</span>
              </div>
              <h3 className="font-headline-sm text-on-surface mb-2">Ingestion</h3>
              <p className="font-body-sm text-on-surface-variant">Real-time IoT sensors streaming Yamuna water quality data.</p>
            </div>
            
            <div className="flex flex-col items-center text-center z-10 group">
              <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mb-6 border-white/10 group-hover:border-primary transition-all">
                <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
              </div>
              <h3 className="font-headline-sm text-on-surface mb-2">Gen AI Processing</h3>
              <p className="font-body-sm text-on-surface-variant">Google Cloud models correlating pathogen data with weather patterns.</p>
            </div>
            
            <div className="flex flex-col items-center text-center z-10 group">
              <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mb-6 border-white/10 group-hover:border-primary transition-all">
                <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
              </div>
              <h3 className="font-headline-sm text-on-surface mb-2">Risk Forecasting</h3>
              <p className="font-body-sm text-on-surface-variant">Advanced predictive analytics projecting contamination vectors.</p>
            </div>
            
            <div className="flex flex-col items-center text-center z-10 group">
              <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mb-6 border-white/10 group-hover:border-primary transition-all">
                <span className="material-symbols-outlined text-primary text-3xl">notifications_active</span>
              </div>
              <h3 className="font-headline-sm text-on-surface mb-2">Preemptive Alert</h3>
              <p className="font-body-sm text-on-surface-variant">Instant localized notifications sent to health authorities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DISEASE SIGNALS */}
      <section id="disease-signals" className="py-32 bg-background">
        <div className="container mx-auto px-margin-desktop">
          <div className="mb-16">
            <h2 className="font-headline-lg text-on-surface text-4xl mb-4">Monitored Disease Signals</h2>
            <p className="text-on-surface-variant max-w-xl">Our intelligence platform tracks biological markers and environmental triggers to identify specific disease risks.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cholera */}
            <div ref={el => cardsRef.current[3] = el} className="glass-card p-8 rounded-3xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-bl-full -mr-8 -mt-8 blur-2xl"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-error text-4xl">warning</span>
                <span className="bg-error/10 text-error px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-error/20">Critical</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-3">Cholera</h3>
              <p className="text-on-surface-variant font-body-md mb-6">Rapid onset prediction based on pH spikes and dissolved oxygen depletion in high-density areas.</p>
              <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-error w-3/4 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
            
            {/* Typhoid */}
            <div ref={el => cardsRef.current[4] = el} className="glass-card p-8 rounded-3xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 blur-2xl"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">science</span>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">Reactive</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-3">Typhoid</h3>
              <p className="text-on-surface-variant font-body-md mb-6">Tracking microbial load trends across residential water supply systems in Okhla and Najafgarh.</p>
              <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-primary w-1/2 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
            
            {/* Hepatitis */}
            <div ref={el => cardsRef.current[5] = el} className="glass-card p-8 rounded-3xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 blur-2xl"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-secondary text-4xl">opacity</span>
                <span className="bg-secondary/10 text-secondary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-secondary/20">Monsoon Alert</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-3">Hepatitis A &amp; E</h3>
              <p className="text-on-surface-variant font-body-md mb-6">Predictive modeling for fecal-oral contamination vectors during high precipitation events.</p>
              <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-secondary w-2/3 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
            
            {/* Acute Diarrhea */}
            <div ref={el => cardsRef.current[6] = el} className="glass-card p-8 rounded-3xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 blur-2xl"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">vital_signs</span>
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">Early Indicator</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-3">Acute Diarrhea</h3>
              <p className="text-on-surface-variant font-body-md mb-6">Early sentinel tracking identifying non-specific waterborne pathogens before major outbreaks.</p>
              <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-primary w-1/3 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-surface-container py-24 border-t border-white/5">
        <div className="container mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
                <span className="text-headline-sm font-headline-sm font-black text-on-surface">AquaGuard AI</span>
              </div>
              <p className="text-on-surface-variant max-w-sm mb-8">
                The next generation of environmental health intelligence. Protecting Delhi's citizens through predictive water science and real-time monitoring.
              </p>
              <div className="flex gap-4">
                <a className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:bg-primary/20 transition-all" href="#">
                  <span className="material-symbols-outlined text-xl text-on-surface-variant">share</span>
                </a>
                <a className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:bg-primary/20 transition-all" href="#">
                  <span className="material-symbols-outlined text-xl text-on-surface-variant">rss_feed</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-on-surface font-bold mb-6">Intelligence</h4>
              <ul className="space-y-4 text-on-surface-variant">
                <li><Link className="hover:text-primary transition-colors" to="/citizen">Citizen Dashboard</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/official">Official API</Link></li>
                <li><a className="hover:text-primary transition-colors" href="#">Risk Heatmap</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Historical Data</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-on-surface font-bold mb-6">Organization</h4>
              <ul className="space-y-4 text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">About the Project</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Public Health Credits</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-label-caps text-outline uppercase tracking-widest">
              © 2024 AquaGuard AI • Developed for the Delhi Water Hackathon
            </p>
            <div className="flex gap-8 text-label-caps font-bold">
              <span className="text-secondary">POWERED BY GOOGLE CLOUD VERTEX AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
