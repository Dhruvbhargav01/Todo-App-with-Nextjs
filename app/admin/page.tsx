// import { supabaseAdmin } from '@/lib/supabaseServer';

// export default async function AdminPanel() {
//   const { data: users, error } = await supabaseAdmin.from('admin_users').select('*');
//   if (error) throw error;

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl mb-6 text-purple-600">Admin Panel</h1>
//       <table className="w-full table-auto border border-gray-700">
//         <thead>
//           <tr>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users?.map((u) => (
//             <tr key={u.id} className="border-t border-gray-600">
//               <td>{u.email}</td>
//               <td>{u.role}</td>
//               <td>{u.status}</td>
//               <td className="flex gap-2">
//                 <button
//                   className="bg-blue-600 px-2 py-1 rounded text-white"
//                   onClick={async () =>
//                     await fetch('/api/admin/toggle-role', {
//                       method: 'POST',
//                       headers: { 'Content-Type': 'application/json' },
//                       body: JSON.stringify({ userId: u.id, role: u.role }),
//                     })
//                   }
//                 >
//                   Toggle Admin
//                 </button>
//                 <button
//                   className="bg-yellow-600 px-2 py-1 rounded text-white"
//                   onClick={async () =>
//                     await fetch('/api/admin/toggle-status', {
//                       method: 'POST',
//                       headers: { 'Content-Type': 'application/json' },
//                       body: JSON.stringify({ userId: u.id, status: u.status }),
//                     })
//                   }
//                 >
//                   Block/Unblock
//                 </button>
//                 <button
//                   className="bg-red-600 px-2 py-1 rounded text-white"
//                   onClick={async () =>
//                     await fetch('/api/admin/delete-user', {
//                       method: 'POST',
//                       headers: { 'Content-Type': 'application/json' },
//                       body: JSON.stringify({ userId: u.id }),
//                     })
//                   }
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { supabaseAdmin } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminPanel() {
  // ✅ Use SERVICE ROLE directly (bypass cookies completely)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // 1. Get current session from headers (simple way)
  const { data: { user } } = await supabaseAdmin.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // 2. Check admin role
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  // 3. Fetch all users
  const { data: users, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">Total Users: {users?.length || 0}</p>
          </div>
          <Link 
            href="/dashboard"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <tr>
                <th className="p-6 text-left font-bold text-lg">Email</th>
                <th className="p-6 text-left font-bold text-lg">Name</th>
                <th className="p-6 text-left font-bold text-lg">Role</th>
                <th className="p-6 text-left font-bold text-lg">Status</th>
                <th className="p-6 text-left font-bold text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-indigo-50">
                  <td className="p-6 font-semibold">{u.email}</td>
                  <td className="p-6">{u.full_name || 'N/A'}</td>
                  <td className="p-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      u.role === 'admin' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      u.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-3">
                      <form action="/api/admin/toggle-role" method="POST">
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="role" value={u.role} />
                        <button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl text-white font-semibold transition-all"
                        >
                          {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </form>
                      
                      <form action="/api/admin/delete-user" method="POST">
                        <input type="hidden" name="userId" value={u.id} />
                        <button 
                          type="submit" 
                          className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl text-white font-semibold transition-all"
                          onClick={(e) => {
                            if (!confirm(`Delete ${u.email}?`)) e.preventDefault();
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
