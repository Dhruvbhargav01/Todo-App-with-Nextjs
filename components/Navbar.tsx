'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="w-full py-4 bg-transparent px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-indigo-700 font-bold">T</div>
            <div>
              <div className="text-lg font-semibold">Glass Todo</div>
              <div className="text-xs text-slate-500 -mt-0.5">Next.js + Supabase</div>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/">Dashboard</Link>
          {user ? (
            <button onClick={handleSignOut} className="px-3 py-1 rounded-md border">Sign out</button>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1 rounded-md border">Log in</Link>
              <Link href="/signup" className="px-3 py-1 rounded-md bg-indigo-600 text-white">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
