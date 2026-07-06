import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function OfficialLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-[#020B18] text-[#dee3e9] font-body-sm relative overflow-hidden">
      {/* Background decorations matching the app's aesthetic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 glass-card rounded-3xl z-10 mx-4 border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)' }}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-headline-md font-headline-md font-black text-primary tracking-tight">AquaGuard AI</h1>
          </Link>
          <h2 className="text-headline-sm font-bold text-on-surface">Official Login</h2>
          <p className="text-label-caps text-on-surface-variant mt-2 tracking-widest uppercase opacity-80">Command Center Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-body-sm text-error font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1" htmlFor="email">Official Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder-on-surface-variant/50"
              placeholder="supervisor@aquaguard.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder-on-surface-variant/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                Authenticating...
              </>
            ) : (
              'Access Command Center'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
