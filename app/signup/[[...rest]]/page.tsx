
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
      });
    }

    setLoading(false);
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-900 to-black opacity-30 animate-pulse"></div>
      </div>

      <form
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-sm rounded-3xl border border-gray-700/50 bg-black/70 backdrop-blur-xl p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-white text-center tracking-wide">Create Account</h2>

        {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-lg border border-gray-600/50 bg-gray-900/30 p-3 placeholder-gray-400 text-white focus:ring-1 focus:ring-gray-500 focus:outline-none backdrop-blur-sm mb-4"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-gray-600/50 bg-gray-900/30 p-3 placeholder-gray-400 text-white focus:ring-1 focus:ring-gray-500 focus:outline-none backdrop-blur-sm mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-gray-600/50 bg-gray-900/30 p-3 placeholder-gray-400 text-white focus:ring-1 focus:ring-gray-500 focus:outline-none backdrop-blur-sm mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold p-3 transition"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <p className="mt-4 text-sm text-gray-300 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-gray-400 underline hover:text-white">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
