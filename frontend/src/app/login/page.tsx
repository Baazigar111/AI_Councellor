"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';

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
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const data = await apiRequest('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      localStorage.setItem('token', data.access_token);
      router.push('/'); 
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Branding Side */}
      <div className="hidden lg:flex w-1/2 bg-brand-dark items-center justify-center p-12 text-white relative">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent opacity-50"></div>
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/40">
            <span className="text-3xl text-white">🎓</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">Your Global education journey starts here.</h2>
          <p className="text-slate-400 text-lg">Access your personalized counsellor for university matches and SOP guidance.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-slate-500 mt-2 font-medium">Continue your application progress.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="email" placeholder="Email Address" required
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300 text-slate-800"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password" placeholder="Password" required
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300 text-slate-800"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold tracking-wide transition-all shadow-xl active:scale-[0.98] disabled:bg-slate-200"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 font-medium">
            Don't have an account? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}