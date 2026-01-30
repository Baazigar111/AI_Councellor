"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import Link from 'next/link'; // Added for navigation

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // FastAPI expects x-www-form-urlencoded for standard login
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const data = await apiRequest('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      localStorage.setItem('token', data.access_token);
      
      // CRITICAL: Push to "/" instead of "/dashboard" 
      // This allows the root page logic to check if onboarding is needed.
      router.push('/'); 
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-900 p-10 shadow-2xl border border-slate-800">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-400">AI Counsellor</h2>
          <p className="mt-2 text-slate-400">Your global education journey starts here</p>
        </div>
        
        {error && (
          <div className="rounded-xl bg-red-900/20 p-4 text-sm text-red-400 border border-red-800/50 animate-shake">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl bg-slate-800 p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 border border-transparent focus:border-blue-500/50"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl bg-slate-800 p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 border border-transparent focus:border-blue-500/50"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 p-4 font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}