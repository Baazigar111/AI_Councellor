"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUserStage = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return router.push('/login');
      }

      try {
        const user = await apiRequest('/user/me');
        
        // Logical check for onboarding status preserved
        if (user.current_stage === "ONBOARDING_INCOMPLETE" || user.current_stage === "ONBOARDING") {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    checkUserStage();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
           <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Checking Journey Status</p>
      </div>
    </div>
  );
}