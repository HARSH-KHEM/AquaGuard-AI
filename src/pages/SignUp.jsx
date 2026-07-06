import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export default function SignUp() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Official');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const docRef = doc(db, 'officials', user.uid);
      await setDoc(docRef, {
        name,
        phone,
        role,
        photoURL: '',
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-[#020B18] text-[#dee3e9] font-body-sm relative overflow-hidden py-8">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 glass-card rounded-3xl z-10 mx-4 border border-white/10 my-auto" style={{ background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)' }}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-headline-md font-headline-md font-black text-primary tracking-tight">AquaGuard AI</h1>
          </Link>
          <h2 className="text-headline-sm font-bold text-on-surface">Official Sign Up</h2>
          <p className="text-label-caps text-on-surface-variant mt-2 tracking-widest uppercase opacity-80">Create Command Center Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-body-sm text-error font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              required
              className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder-on-surface-variant/50"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              required
              className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder-on-surface-variant/50"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1" htmlFor="role">Role / Designation</label>
            <input
              id="role"
              type="text"
              required
              className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder-on-surface-variant/50"
              placeholder="e.g. Regional Supervisor"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            />
          </div>
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
            className="w-full py-3.5 mt-2 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-on-surface-variant text-body-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
