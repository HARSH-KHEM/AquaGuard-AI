import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { localities } from '../data/mockData';

export default function ReportIssue() {
  const { currentUser, profile } = useAuth();
  const navigate = useNavigate();
  
  const [area, setArea] = useState('');
  const [issueType, setIssueType] = useState('Contaminated Water');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile?.phone) {
      setPhone(profile.phone);
    }
  }, [profile]);

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

  const clearFile = () => {
    setFile(null);
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!area || !issueType || !description || !phone) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      let photoURL = null;

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

      await addDoc(collection(db, 'complaints'), {
        uid: currentUser.uid,
        name: profile?.name || currentUser.email,
        phone,
        area,
        issueType,
        description,
        photoURL,
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setSuccess(true);
      setArea('');
      setIssueType('Contaminated Water');
      setDescription('');
      clearFile();
      
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while submitting your complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-[#020B18] text-[#dee3e9] font-body-sm relative overflow-hidden py-12 px-4 md:px-margin-desktop">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM SECTION */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)' }}>
          <div className="mb-8">
            <h1 className="text-headline-md font-headline-md font-bold text-on-surface">Report a Water Issue</h1>
            <p className="text-body-sm text-on-surface-variant mt-2">Submit a complaint for investigation by the regional water authority.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-error">error</span>
              <p className="text-body-sm text-error font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <p className="text-body-sm text-secondary font-medium">Your complaint has been submitted successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1">Area / Locality *</label>
                <select required value={area} onChange={e => setArea(e.target.value)} disabled={loading} className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 outline-none text-on-surface appearance-none">
                  <option value="" disabled>Select your area</option>
                  {localities.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                  <option value="Other">Other (Not Listed)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1">Issue Type *</label>
                <select required value={issueType} onChange={e => setIssueType(e.target.value)} disabled={loading} className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 outline-none text-on-surface appearance-none">
                  <option value="Contaminated Water">Contaminated Water</option>
                  <option value="Low Pressure">Low Pressure</option>
                  <option value="Leakage">Leakage</option>
                  <option value="No Supply">No Supply</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1">Description *</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} disabled={loading} rows="4" className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 outline-none placeholder-on-surface-variant/50 resize-none" placeholder="Provide details about the issue..." />
            </div>

            <div>
              <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1">Contact Number *</label>
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/30 outline-none placeholder-on-surface-variant/50" placeholder="+91 XXXXX XXXXX" />
            </div>

            <div>
              <label className="block text-label-caps font-bold text-on-surface mb-2 pl-1">Photo (Optional)</label>
              <div className="flex items-start gap-4">
                {preview ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/10">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={clearFile} disabled={loading} className="absolute top-1 right-1 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-surface-container relative cursor-pointer group">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">add_a_photo</span>
                    <span className="text-label-sm text-on-surface-variant mt-2 group-hover:text-primary transition-colors">Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-body-sm text-on-surface-variant">Attach a clear photo of the issue if possible (e.g. water color, broken pipe). This helps our automated systems prioritize the response.</p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20">
              {loading ? (
                <><span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span> Submitting...</>
              ) : 'Submit Complaint'}
            </button>
          </form>
        </div>

        {/* HELPLINE SIDEBAR */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 border border-white/10 bg-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
              <h3 className="text-headline-sm font-bold text-on-surface">Helpline</h3>
            </div>
            <p className="text-body-sm text-on-surface-variant mb-6">For immediate assistance or emergencies, please contact our 24/7 water monitoring helpline.</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-surface-container p-4 rounded-xl">
                <span className="material-symbols-outlined text-secondary">call</span>
                <div>
                  <p className="text-label-caps text-on-surface-variant">Toll Free Number</p>
                  <p className="text-body-lg font-bold text-on-surface">1800-AQUA-HELP</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-surface-container p-4 rounded-xl">
                <span className="material-symbols-outlined text-secondary">schedule</span>
                <div>
                  <p className="text-label-caps text-on-surface-variant">Working Hours</p>
                  <p className="text-body-md font-bold text-on-surface">24 Hours / 7 Days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10">
            <h3 className="text-title-md font-bold text-on-surface mb-4">When to use this form?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span className="text-body-sm text-on-surface-variant">Non-emergency supply issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span className="text-body-sm text-on-surface-variant">Reporting mild discoloration or odor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span className="text-body-sm text-on-surface-variant">Minor pipeline leaks on streets</span>
              </li>
            </ul>
            
            <h3 className="text-title-md font-bold text-on-surface mt-6 mb-4">When to call the emergency line?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                <span className="text-body-sm text-on-surface-variant">Severe medical illness linked to water</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                <span className="text-body-sm text-on-surface-variant">Major water main bursts</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
