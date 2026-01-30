"use client";
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import UniversityCard from '@/components/UniversityCard';
import { useRouter } from 'next/navigation';

export default function DiscoveryPage() {
  const [unis, setUnis] = useState([]);
  const [shortlistedIds, setShortlistedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- LOGIC PRESERVED ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [uniData, userData] = await Promise.all([
          apiRequest('/user/universities'),
          apiRequest('/user/me')
        ]);
        setUnis(uniData);
        setShortlistedIds(userData.shortlisted_universities.map((u: any) => u.id));
      } catch (err) {
        console.error("Failed to load discovery data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleShortlist = async (uniId: number) => {
    try {
      await apiRequest(`/user/shortlist/${uniId}`, { method: 'POST' });
      setShortlistedIds(prev => 
        prev.includes(uniId) ? prev.filter(id => id !== uniId) : [...prev, uniId]
      );
    } catch (err) {
      console.error("Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-900 p-10 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              University Discovery
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Explore institutions curated for your academic profile.
            </p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-sm text-slate-700 active:scale-95"
          >
            <span>←</span> Back to Dashboard
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Finding your matches...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {unis.map((uni: any) => {
              const isShortlisted = shortlistedIds.includes(uni.id);
              return (
                <div key={uni.id} className="flex flex-col animate-slide-up">
                  {/* The updated professional card component */}
                  <UniversityCard uni={uni} />
                  
                  {/* Action Button positioned cleanly below the card */}
                  <button 
                    onClick={() => handleShortlist(uni.id)}
                    className={`mt-4 w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.97] ${
                      isShortlisted 
                      ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default' 
                      : 'bg-slate-900 hover:bg-black text-white shadow-slate-200'
                    }`}
                  >
                    {isShortlisted ? "✓ Shortlisted" : "Shortlist University"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}