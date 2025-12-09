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
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // fetch role from users table
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error && data) setRole(data.role);
      }
    };
    fetchUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) setRole(data.role);
          });
      } else {
        setRole(null);
      }
    });

    return () => {
      sub.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <nav className="w-full py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800/80 backdrop-blur-md px-6 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold">T</div>
            <div>
              <div className="text-lg font-semibold text-white">Todo Mania</div>
              <div className="text-xs text-indigo-300 -mt-0.5">In organised Manner</div>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-white hover:text-indigo-400 transition"
          >
            Dashboard
          </Link>

          {/* Show Admin Panel if user is admin */}
          {role === 'admin' && (
            <Link
              href="/admin"
              className="text-white hover:text-pink-400 transition"
            >
              Admin Panel
            </Link>
          )}

          {user ? (
            <>
              <span className="text-sm text-indigo-200">Hi, {user.email ?? user.user_metadata?.full_name ?? user.id}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1 rounded-md border border-indigo-600 bg-indigo-800 text-white hover:bg-indigo-700 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1 rounded-md border border-indigo-600 bg-indigo-800 text-white hover:bg-indigo-700 transition"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 rounded-md bg-pink-600 text-white hover:bg-pink-500 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

