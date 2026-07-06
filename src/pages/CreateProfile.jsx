import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function CreateProfile() {
  const { currentUser, profile, profileComplete } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Official');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  React.useEffect(() => {
    if (profileComplete && profile && !initialized) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setRole(profile.role || 'Official');
      setPreview(profile.photoURL || '');
      setInitialized(true);
    }
  }, [profile, profileComplete, initialized]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !role || (!file && !profile?.photoURL)) {
      setError('Please fill all fields and provide a profile picture.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      let photoURL = profile?.photoURL || '';

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'aquaguard_profile_pics');

        const response = await fetch('https://api.cloudinary.com/v1_1/iwetkx30/image/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const data = await response.json();
        photoURL = data.secure_url;
      }

      const docRef = doc(db, 'officials', currentUser.uid);
      await setDoc(docRef, {
        name,
        phone,
        role,
        photoURL,
        email: currentUser.email,
        updatedAt: new Date().toISOString(),
        ...(!profileComplete && { createdAt: new Date().toISOString() })
      }, { merge: true });

      window.location.href = '/';
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during profile creation.');
      setLoading(false);
    }
  };

  const isEditing = profileComplete;

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-[#020B18] text-[#dee3e9] font-body-sm relative overflow-hidden p-4">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="w-full max-w-lg p-8 glass-card rounded-3xl z-10 mx-4 border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)' }}>
        <div className="text-center mb-8">
          <h2 className="text-headline-sm font-bold text-on-surface">
            {isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-2">
            {isEditing ? 'Update your official profile details.' : 'Please provide your details to access the Command Center.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-body-sm text-error font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container border-2 border-primary flex items-center justify-center relative group cursor-pointer">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant group-hover:text-primary transition-colors">person</span>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-label-sm text-primary mt-2">Upload Photo</p>
          </div>

          <div>
            <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1">Full Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} disabled={loading} className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 outline-none placeholder-on-surface-variant/50" placeholder="e.g. Jane Doe" />
          </div>
          <div>
            <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1">Phone Number</label>
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 outline-none placeholder-on-surface-variant/50" placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1">Role / Designation</label>
            <input required type="text" value={role} onChange={e => setRole(e.target.value)} disabled={loading} className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 outline-none placeholder-on-surface-variant/50" placeholder="e.g. Regional Supervisor" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 mt-4 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20">
            {loading ? (
              <><span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span> Saving...</>
            ) : (isEditing ? 'Save Changes' : 'Complete Profile')}
          </button>
        </form>
      </div>
    </div>
  );
}
