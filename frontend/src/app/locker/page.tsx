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
    
    // Auto-detect if we are running locally or on the live site
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://127.0.0.1:8000' 
      : 'https://ai-councellor.onrender.com'; // Your live Render URL

    const response = await fetch(`${baseUrl}/user/download-sop`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/pdf'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Please save your SOP first.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP_${new Date().toLocaleDateString()}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Memory cleanup
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (err: any) {
    // Better error message for production
    alert(err.message === "Failed to fetch" 
      ? "Live server is waking up (Render Free Tier). Please wait 30 seconds and try again." 
      : err.message);
  }
};

  return (
    <div className="min-h-screen bg-brand-bg text-slate-900 p-10 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">SOP Locker</h1>
            <p className="text-slate-500 mt-2 font-medium">Refine your narrative for your target universities.</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-all"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
          </button>
        </header>

        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm w-fit">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSopReady ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <span className={`text-xs font-bold tracking-tight ${isSopReady ? 'text-green-600' : 'text-slate-400'}`}>
              {isSopReady ? 'FINALIZED' : 'DRAFT MODE'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-slide-up">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Statement of Purpose</h2>
            <button 
              disabled={!isSopReady || isSaving}
              onClick={downloadPdf}
              className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-30 disabled:grayscale transition-all cursor-pointer"
            >
              <span>Download PDF</span>
              <span className="text-base">📄</span>
            </button>
          </div>

          <div className="p-8">
            <textarea 
              className="w-full h-125 bg-white border-none focus:ring-0 text-slate-800 leading-[1.8] font-serif text-lg resize-none placeholder:text-slate-200"
              placeholder="Start drafting your journey here..."
              value={sop}
              onChange={(e) => setSop(e.target.value)}
            />
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button 
              onClick={saveSop}
              disabled={isSaving}
              className="w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg active:scale-[0.98] cursor-pointer"
            >
              {isSaving ? "Syncing to Cloud..." : "Save and Lock SOP"}
            </button>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-slate-400 font-medium">
          Saved drafts are encrypted and stored in your secure Document Locker.
        </p>
      </div>
    </div>
  );
}