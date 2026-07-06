import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function MyComplaints() {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const q = query(
          collection(db, 'complaints'),
          where('uid', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchComplaints();
    }
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full text-[12px] font-bold">Resolved</span>;
      case 'In Progress':
        return <span className="bg-tertiary/20 text-tertiary border border-tertiary/30 px-3 py-1 rounded-full text-[12px] font-bold">In Progress</span>;
      case 'Pending':
      default:
        return <span className="bg-error/20 text-error border border-error/30 px-3 py-1 rounded-full text-[12px] font-bold">Pending</span>;
    }
  };

  return (
    <div className="dark min-h-screen bg-[#020B18] text-[#dee3e9] font-body-sm relative py-12 px-4 md:px-margin-desktop">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-headline-md font-headline-md font-bold text-on-surface">My Complaints</h1>
          <p className="text-body-sm text-on-surface-variant mt-2">Track the status of your reported water issues.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-white/10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 opacity-50">inbox</span>
            <h3 className="text-title-lg font-bold text-on-surface mb-2">No complaints yet</h3>
            <p className="text-body-md text-on-surface-variant">You haven't reported any water issues.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map(complaint => (
              <div key={complaint.id} className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors flex flex-col md:flex-row gap-6">
                {complaint.photoURL && (
                  <div className="w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-surface-container">
                    <img src={complaint.photoURL} alt="Complaint" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <h3 className="text-title-md font-bold text-on-surface">{complaint.issueType}</h3>
                      <div className="shrink-0">{getStatusBadge(complaint.status)}</div>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span className="text-label-sm font-bold uppercase tracking-wider">{complaint.area}</span>
                    </div>
                    <p className="text-body-md text-on-surface-variant line-clamp-3">{complaint.description}</p>
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
    </div>
  );
}
