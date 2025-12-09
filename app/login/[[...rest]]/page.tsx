'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  console.log('LOGIN RESULT:', { data, error }); // 👈 ye add karo

  setLoading(false);

  if (error) {
    setError(error.message);
    return;
  }

  router.push('/dashboard');
};


  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-900 to-black opacity-30 animate-pulse"></div>
      </div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-gray-700/50 bg-black/70 backdrop-blur-xl p-8 shadow-2xl"
      >
        <h2 className="mb-6 text-3xl font-bold text-white text-center tracking-wide">Login</h2>

        {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-lg border border-gray-600/50 bg-gray-900/30 p-3 placeholder-gray-400 text-white focus:ring-1 focus:ring-gray-500 focus:outline-none backdrop-blur-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded-lg border border-gray-600/50 bg-gray-900/30 p-3 placeholder-gray-400 text-white focus:ring-1 focus:ring-gray-500 focus:outline-none backdrop-blur-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold p-3 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-sm text-gray-300 text-center">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-gray-400 underline hover:text-white">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
}
