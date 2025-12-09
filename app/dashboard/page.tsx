// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import Navbar from '@/components/Navbar';
// import TodoForm from '@/components/TodoForm';
// import TodoItem from '@/components/TodoItem';
// import * as Tabs from '@radix-ui/react-tabs';

// type Todo = {
//   id: string;
//   title: string;
//   description?: string;
//   is_complete: boolean;
//   created_at: string;
// };

// export default function DashboardPage() {
//   const [session, setSession] = useState<any>(null);
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const init = async () => {
//       const { data } = await supabase.auth.getSession();
//       if (!data.session) {
//         window.location.href = '/login';
//         return;
//       }
//       setSession(data.session);
//       fetchTodos(data.session.user.id);
//     };

//     init();

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
//       if (!s) window.location.href = '/login';
//       else {
//         setSession(s);
//         fetchTodos(s.user.id);
//       }
//     });

//     return () => listener.subscription?.unsubscribe();
//   }, []);

//   const fetchTodos = async (userId: string) => {
//     const { data } = await supabase
//       .from('todos')
//       .select('*')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false });
//     setTodos(data || []);
//     setLoading(false);
//   };

//   const addTodo = async ({ title, description }: { title: string; description?: string }) => {
//     if (!session) return;
//     const { data } = await supabase
//       .from('todos')
//       .insert({ user_id: session.user.id, title, description })
//       .select()
//       .single();
//     if (data) setTodos(prev => [data, ...prev]);
//   };

//   const updateTodo = async (id: string, updates: Partial<Todo>) => {
//     const { data } = await supabase
//       .from('todos')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();
//     if (data) setTodos(prev => prev.map(todo => (todo.id === id ? data : todo)));
//   };

//   const deleteTodo = async (id: string) => {
//     await supabase.from('todos').delete().eq('id', id);
//     setTodos(prev => prev.filter(todo => todo.id !== id));
//   };

//   if (loading)
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
//         <p>Loading...</p>
//       </div>
//     );

//   if (!session) return null;

//   // Filter todos for each tab
//   const today = new Date().toISOString().split('T')[0];
//   const todayTodos = todos.filter(todo => todo.created_at.startsWith(today));
//   const completedTodos = todos.filter(todo => todo.is_complete);
//   const pendingTodos = todos.filter(todo => !todo.is_complete);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       <Navbar />
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-3xl font-semibold mb-6">My Todo Dashboard</h1>
//         <TodoForm onAdd={addTodo} />

//         <Tabs.Root defaultValue="today" className="mt-6">
//           <Tabs.List className="flex space-x-2 border-b border-purple-100">
//             <Tabs.Trigger
//               value="today"
//               className="px-4 py-2 text-sm font-medium text-purple-200 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:font-semibold"
//             >
//               Today&apos;s Todos ({todayTodos.length})
//             </Tabs.Trigger>
//             <Tabs.Trigger
//               value="completed"
//               className="px-4 py-2 text-sm font-medium text-purple-200 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:font-semibold"
//             >
//               Completed ({completedTodos.length})
//             </Tabs.Trigger>
//             <Tabs.Trigger
//               value="pending"
//               className="px-4 py-2 text-sm font-medium text-purple-200 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:font-semibold"
//             >
//               Pending ({pendingTodos.length})
//             </Tabs.Trigger>
//           </Tabs.List>

//           <Tabs.Content value="today" className="mt-4 space-y-4">
//             {todayTodos.length === 0 && <p className="text-purple-300">No todos for today.</p>}
//             {todayTodos.map(todo => (
//               <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
//             ))}
//           </Tabs.Content>

//           <Tabs.Content value="completed" className="mt-4 space-y-4">
//             {completedTodos.length === 0 && <p className="text-purple-300">No completed todos.</p>}
//             {completedTodos.map(todo => (
//               <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
//             ))}
//           </Tabs.Content>

//           <Tabs.Content value="pending" className="mt-4 space-y-4">
//             {pendingTodos.length === 0 && <p className="text-purple-300">No pending todos.</p>}
//             {pendingTodos.map(todo => (
//               <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
//             ))}
//           </Tabs.Content>
//         </Tabs.Root>

//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // ✅ Link import
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import * as Tabs from '@radix-ui/react-tabs';

type Todo = {
  id: string;
  title: string;
  description?: string;
  is_complete: boolean;
  created_at: string;
  user_id: string;
};

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('getSession error:', error);
        return;
      }

      if (!data.session) {
        window.location.href = '/login';
        return;
      }

      setSession(data.session);

      // 🔥 CHECK ROLE
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (profileError) {
        console.error('profile role error:', profileError);
      }

      setUserRole((profile as any)?.role === 'admin' ? 'admin' : 'user');

      fetchTodos(data.session.user.id);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!s) {
        window.location.href = '/login';
      } else {
        setSession(s);
        fetchTodos(s.user.id);
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const fetchTodos = async (userId: string) => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch todos error:', error);
    } else {
      setTodos((data as Todo[]) || []);
    }
    setLoading(false);
  };

  const addTodo = async ({
    title,
    description,
  }: {
    title: string;
    description?: string;
  }) => {
    if (!session) return;

    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: session.user.id,
        title,
        description,
        is_complete: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Add todo error:', error);
    } else if (data) {
      setTodos((prev) => [data as Todo, ...prev]);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update todo error:', error);
    } else if (data) {
      setTodos((prev) => prev.map((t) => (t.id === id ? (data as Todo) : t)));
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      console.error('Delete todo error:', error);
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-2xl text-gray-900 font-semibold">Loading todos...</p>
      </div>
    );
  }

  if (!session) return null;

  const today = new Date().toDateString();
  const todayTodos = todos.filter(
    (todo) => new Date(todo.created_at).toDateString() === today,
  );
  const completedTodos = todos.filter((todo) => todo.is_complete);
  const pendingTodos = todos.filter((todo) => !todo.is_complete);

  return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="max-w-4xl mx-auto p-6">
      
      {userRole === 'admin' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl">
          <Link
            href="/admin"
            className="text-red-900 font-bold text-lg hover:text-red-950"
          >
            Admin Panel → Manage All Users
          </Link>
        </div>
      )}

      <h1 className="text-4xl font-black mb-8 text-gray-900">
        My Todo Dashboard
      </h1>
      <TodoForm onAdd={addTodo} />

      <Tabs.Root defaultValue="pending" className="mt-12">
        <Tabs.List className="flex bg-white rounded-xl p-1 shadow-2xl mb-8">
          <Tabs.Trigger
            value="today"
            className="flex-1 px-6 py-4 text-base font-extrabold rounded-lg text-gray-900 data-[state=active]:bg-purple-600 data-[state=active]:text-gray-50 shadow-lg transition-all"
          >
            Today ({todayTodos.length})
          </Tabs.Trigger>
          <Tabs.Trigger
            value="completed"
            className="flex-1 px-6 py-4 text-base font-extrabold rounded-lg text-gray-900 data-[state=active]:bg-emerald-600 data-[state=active]:text-gray-50 shadow-lg transition-all"
          >
            Completed ({completedTodos.length})
          </Tabs.Trigger>
          <Tabs.Trigger
            value="pending"
            className="flex-1 px-6 py-4 text-base font-extrabold rounded-lg text-gray-900 data-[state=active]:bg-orange-600 data-[state=active]:text-gray-50 shadow-lg transition-all"
          >
            Pending ({pendingTodos.length})
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="today" className="space-y-4 pb-8">
          {todayTodos.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-2xl text-gray-900 mb-2">📅 No todos for today</p>
              <p className="text-lg text-gray-800">Add your first todo above!</p>
            </div>
          ) : (
            todayTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </Tabs.Content>

        <Tabs.Content value="completed" className="space-y-4 pb-8">
          {completedTodos.length === 0 ? (
            <div className="text-center py-16 bg-green-50 rounded-2xl border-2 border-green-200">
              <p className="text-2xl text-gray-900 mb-2">
                ✅ No completed todos
              </p>
              <p className="text-lg text-gray-800">
                Complete some todos to see them here!
              </p>
            </div>
          ) : (
            completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </Tabs.Content>

        <Tabs.Content value="pending" className="space-y-4 pb-8">
          {pendingTodos.length === 0 ? (
            <div className="text-center py-16 bg-orange-50 rounded-2xl border-2 border-orange-200">
              <p className="text-2xl text-gray-900 mb-2">🎯 No pending todos</p>
              <p className="text-lg text-gray-800">
                You&apos;re all caught up! Great job! 👏
              </p>
            </div>
          ) : (
            pendingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
);

}
