"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function DocumentLocker() {
  const [sop, setSop] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSopReady, setIsSopReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiRequest('/user/me');
        setSop(data.profile?.sop_content || '');
        setIsSopReady(data.profile?.is_sop_ready || false);
      } catch (err) {
        console.error("Failed to load profile");
      }
    };
    loadProfile();
  }, []);

  const saveSop = async () => {
    setIsSaving(true);
    try {
      await apiRequest('/user/onboarding', {
        method: 'POST',
        body: JSON.stringify({ sop_content: sop, is_sop_ready: true })
      });
      setIsSopReady(true);
      
      // OPTIONAL: Automatically clear a task if one existed for drafting the SOP
      alert("SOP Saved successfully!");
    } catch (err) {
      console.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/user/download-sop', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Please save your SOP first.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "My_Statement_of_Purpose.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-blue-400">SOP Locker</h1>
            <p className="text-slate-500 mt-2">Refine and finalize your Statement of Purpose.</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Chat
          </button>
        </div>

        <div className="inline-flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isSopReady ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`}></div>
            <span className="text-xs font-bold">{isSopReady ? 'READY' : 'DRAFT'}</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold">Your Statement of Purpose</h2>
            <button 
              disabled={!isSopReady}
              onClick={downloadPdf}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Download PDF</span>
              <span>📄</span>
            </button>
          </div>

          <textarea 
            className="w-full h-125 bg-slate-950 border border-slate-800 rounded-2xl p-8 outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-300 leading-relaxed font-serif text-lg resize-none"
            placeholder="Introduce yourself, your academic background, and your goals..."
            value={sop}
            onChange={(e) => setSop(e.target.value)}
          />

          <button 
            onClick={saveSop}
            disabled={isSaving}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] text-white"
          >
            {isSaving ? "Saving to Cloud..." : "Save SOP Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}