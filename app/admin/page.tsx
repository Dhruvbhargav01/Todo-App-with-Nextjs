'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type User = {
  id: string;
  email: string;
  role: string;
  status: string;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) console.error(error);
    else setUsers(data);
  };

  const updateUserRole = async (id: string, role: string) => {
    await supabase.from('users').update({ role }).eq('id', id);
    fetchUsers();
  };

  const updateUserStatus = async (id: string, status: string) => {
    await supabase.from('users').update({ status }).eq('id', id);
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Admin Panel</h1>
      <table className="w-full table-auto border border-gray-700">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-600">
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td className="flex gap-2">
                <button
                  onClick={() =>
                    updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')
                  }
                  className="bg-blue-600 px-2 py-1 rounded text-white"
                >
                  Toggle Admin
                </button>
                <button
                  onClick={() =>
                    updateUserStatus(user.id, user.status === 'active' ? 'blocked' : 'active')
                  }
                  className="bg-yellow-600 px-2 py-1 rounded text-white"
                >
                  Block/Unblock
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-600 px-2 py-1 rounded text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
