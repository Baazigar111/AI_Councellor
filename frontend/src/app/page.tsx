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
        // Fetch real user data from our new /user/me endpoint
        const user = await apiRequest('/user/me');
        
        if (user.current_stage === "ONBOARDING_INCOMPLETE") {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        // If token is invalid/expired, clear it and go to login
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    checkUserStage();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-slate-400 font-medium animate-pulse">Checking your journey status...</p>
      </div>
    </div>
  );
}