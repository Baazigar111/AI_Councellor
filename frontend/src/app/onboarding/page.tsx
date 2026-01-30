"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function Onboarding() {
  const [formData, setFormData] = useState({
    major: '',
    gpa: '', // Keep as string for input handling
    budget_max: '' // Keep as string for input handling
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Prepare the payload with explicit type casting
      const payload = {
        major: formData.major,
        gpa: parseFloat(formData.gpa) || 0,
        budget_max: parseInt(formData.budget_max) || 0,
        education_level: "Undergraduate", // Default or add another field
      };

      // 2. Send request to the new endpoint
      await apiRequest('/user/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      // 3. Force push to dashboard upon success
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Onboarding failed:", err);
      alert(`Error saving profile: ${err.message || 'Check your internet or backend console.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md space-y-6 shadow-2xl transition-all"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-blue-400">Tell us about yourself</h1>
          <p className="text-slate-500 text-sm">We'll use this to personalize your university search.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Current Major/Degree</label>
            <input 
              placeholder="e.g., BCA or B.Tech" 
              className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 mt-1 border border-transparent focus:border-blue-500/50"
              value={formData.major}
              onChange={e => setFormData({...formData, major: e.target.value})} 
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Current GPA / Percentage</label>
            <input 
              type="text" // Using text to allow decimal points easily
              placeholder="e.g., 3.8 or 85" 
              className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 mt-1 border border-transparent focus:border-blue-500/50"
              value={formData.gpa}
              onChange={e => setFormData({...formData, gpa: e.target.value})} 
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Max Budget (USD)</label>
            <input 
              type="text"
              placeholder="e.g., 40000" 
              className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 mt-1 border border-transparent focus:border-blue-500/50"
              value={formData.budget_max}
              onChange={e => setFormData({...formData, budget_max: e.target.value})} 
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 py-4 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95"
        >
          {isLoading ? "Saving Profile..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}