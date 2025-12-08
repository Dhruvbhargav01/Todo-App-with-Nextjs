'use client';
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import GlassCard from '../../components/GlassCard';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      return alert(error.message);
    }
    // Optionally create profile row (server side ideally)
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: fullName });
    }
    setLoading(false);
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto">
      <GlassCard>
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" className="w-full p-3 rounded-md border" />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full p-3 rounded-md border" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full p-3 rounded-md border" />
          <button className="w-full py-2 rounded-md text-white bg-gradient-to-r from-indigo-500 to-indigo-400" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm">Already have an account? <a className="text-indigo-600 underline" href="/login">Log in</a></p>
      </GlassCard>
    </div>
  );
}
