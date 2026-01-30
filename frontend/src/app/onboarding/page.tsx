"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function Onboarding() {
  const [formData, setFormData] = useState({ major: '', gpa: '', budget_max: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        major: formData.major,
        gpa: parseFloat(formData.gpa) || 0,
        budget_max: parseInt(formData.budget_max) || 0,
        education_level: "Undergraduate", 
      };

      await apiRequest('/user/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      alert(`Error saving profile: ${err.message || 'Check connection.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-8">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-10 rounded-3xl border border-slate-100 w-full max-w-md space-y-8 shadow-2xl shadow-slate-200 animate-slide-up"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tell us about yourself</h1>
          <p className="text-slate-500 text-sm font-medium">Personalize your journey to find the best matches.</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Major/Degree</label>
            <input 
              placeholder="e.g., BCA or B.Tech" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-800 text-sm"
              value={formData.major}
              onChange={e => setFormData({...formData, major: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current GPA / Percentage</label>
            <input 
              type="text" placeholder="e.g., 3.8 or 85" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-800 text-sm"
              value={formData.gpa}
              onChange={e => setFormData({...formData, gpa: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Max Budget (USD)</label>
            <input 
              type="text" placeholder="e.g., 40000" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-800 text-sm"
              value={formData.budget_max}
              onChange={e => setFormData({...formData, budget_max: e.target.value})} 
            />
          </div>
        </div>

        <button 
          type="submit" disabled={isLoading}
          className="w-full bg-slate-900 hover:bg-black py-4 rounded-2xl font-bold text-white text-sm tracking-wide transition-all shadow-xl active:scale-95 disabled:bg-slate-200"
        >
          {isLoading ? "Saving Profile..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}