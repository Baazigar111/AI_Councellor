"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Call your registration endpoint
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // 2. Redirect to login so the user can get their first token
      router.push('/login');
    } catch (err: any) {
      setError(err.message || "Registration failed. Try a different email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSignup} 
        className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md space-y-6 shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-400">Join the Journey</h1>
          <p className="text-slate-500 mt-2">Create your account to start your study abroad path.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Full Name" 
            className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setFormData({...formData, full_name: e.target.value})} 
            required
          />
          <input 
            type="email"
            placeholder="Email Address" 
            className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required
          />
          <input 
            type="password"
            placeholder="Password" 
            className="w-full bg-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-slate-500 text-sm">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}