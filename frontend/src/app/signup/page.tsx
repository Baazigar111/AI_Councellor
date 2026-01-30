"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      router.push('/login');
    } catch (err: any) {
      setError(err.message || "Registration failed. Try a different email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-bg items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200">
        <div className="text-center">
          <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-4">🎓</div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join the Journey</h1>
          <p className="text-slate-500 mt-2 font-medium">Create your mentor profile today.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl">{error}</div>}

          <div className="space-y-4">
            <input 
              type="text" placeholder="Full Name" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-800"
              onChange={e => setFormData({...formData, full_name: e.target.value})} 
            />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-800"
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
            <input 
              type="password" placeholder="Password" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-800"
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold tracking-wide transition-all shadow-xl active:scale-[0.98] shadow-blue-900/10"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 font-medium pt-4">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}