// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabaseClient';

// export default function Navbar() {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };
//     fetchUser();

//     const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => {
//       sub.subscription?.unsubscribe();
//     };
//   }, []);

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     window.location.href = '/login';
//   };

//   return (
//     <nav className="w-full py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md px-6 shadow-sm">
//       <div className="max-w-4xl mx-auto flex items-center justify-between">
//         <Link href="/">
//           <div className="flex items-center gap-3 cursor-pointer">
//             <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center text-indigo-700 font-bold">T</div>
//             <div>
//               <div className="text-lg font-semibold text-gray-800 dark:text-white">Todo Mania</div>
//               <div className="text-xs text-gray-500 dark:text-gray-800 -mt-0.5">In organise Manner</div>
//             </div>
//           </div>
//         </Link>

//         <div className="flex items-center gap-4">
//           <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
//             Dashboard
//           </Link>
//           {user ? (
//             <>
//               <span className="text-sm text-gray-700 dark:text-gray-200">Hi, {user.email ?? user.user_metadata?.full_name ?? user.id}</span>
//               <button
//                 onClick={handleSignOut}
//                 className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
//               >
//                 Sign out
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 href="/login"
//                 className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
//               >
//                 Log in
//               </Link>
//               <Link
//                 href="/signup"
//                 className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition"
//               >
//                 Sign up
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();

        if (!error && profile) {
          setRole(profile.role);
        } else {
          setRole('user');
        }
      }
    };

    fetchUserRole();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single()
          .then(({ data: profile, error }) => {
            if (!error && profile) setRole(profile.role);
            else setRole('user');
          });
      } else {
        setRole(null);
      }
    });

    return () => sub.subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <nav className="w-full py-6 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900/80 backdrop-blur-xl px-6 shadow-2xl border-b border-slate-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-slate-50 font-black text-xl shadow-2xl group-hover:scale-110 transition-all">
              T
            </div>
            <div>
              <div className="text-xl font-black text-slate-50 tracking-tight">
                Todo Mania
              </div>
              <div className="text-xs text-slate-200 font-medium">
                Organised Chaos
              </div>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-slate-100 hover:text-white font-semibold px-4 py-2 rounded-xl hover:bg-slate-800/60 transition-all duration-300"
          >
            Dashboard
          </Link>

          {role === 'admin' && (
            <Link
              href="/admin"
              className="text-amber-200 hover:text-amber-100 font-black px-6 py-2 bg-amber-500/25 border border-amber-300/60 rounded-2xl shadow-lg hover:shadow-xl hover:bg-amber-500/35 transition-all duration-300"
            >
              👑 ADMIN PANEL
            </Link>
          )}

          {user ? (
            <>
              <span className="text-sm text-slate-100 font-medium bg-slate-800/60 px-3 py-1 rounded-full">
                Hi, {user.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={handleSignOut}
                className="px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-500 text-slate-50 font-semibold rounded-xl border border-slate-400 hover:from-slate-500 hover:to-slate-400 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-500 text-slate-50 font-semibold rounded-xl border border-slate-400 hover:from-slate-500 hover:to-slate-400 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-400 text-slate-50 font-black rounded-xl shadow-2xl hover:shadow-3xl hover:from-pink-400 hover:to-pink-300 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
