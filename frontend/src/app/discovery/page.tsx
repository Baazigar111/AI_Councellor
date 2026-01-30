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
      // Update local state to show "Shortlisted" immediately
      setShortlistedIds(prev => 
        prev.includes(uniId) ? prev.filter(id => id !== uniId) : [...prev, uniId]
      );
    } catch (err) {
      console.error("Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-blue-400">University Discovery</h1>
            <p className="text-slate-500 mt-2">Explore 20 institutions curated for your profile.</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-xl border border-slate-700 transition-all font-medium"
          >
            ← Back to Chat
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {unis.map((uni: any) => {
              const isShortlisted = shortlistedIds.includes(uni.id);
              return (
                <div key={uni.id} className="relative group bg-slate-900/50 p-4 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all">
                  <UniversityCard uni={uni} />
                  <button 
                    onClick={() => handleShortlist(uni.id)}
                    className={`mt-4 w-full py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                      isShortlisted 
                      ? 'bg-slate-800 text-slate-400 border border-slate-700' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
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