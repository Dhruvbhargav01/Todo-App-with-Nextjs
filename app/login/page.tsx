'use client';

import React, { useState } from 'react';
import { supabase} from '../../lib/supabaseClient';
import GlassCard from '../../components/GlassCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <GlassCard>
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md border"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md border"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-white bg-gradient-to-r from-indigo-500 to-indigo-400"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-600 underline">
            Sign up
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
