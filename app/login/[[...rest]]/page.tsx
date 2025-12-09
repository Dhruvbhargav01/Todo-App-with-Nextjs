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

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-gray-300/30 bg-white/60 backdrop-blur-md p-6 shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Login</h2>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-md border border-gray-300/50 bg-white/30 p-3 placeholder-gray-500 text-gray-800 focus:ring-1 focus:ring-blue-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded-md border border-gray-300/50 bg-white/30 p-3 placeholder-gray-500 text-gray-800 focus:ring-1 focus:ring-blue-400 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 p-3 text-white hover:bg-blue-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-sm text-gray-700">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-600 underline">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
}
