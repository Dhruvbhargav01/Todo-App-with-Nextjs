'use client';

import { useEffect, useState } from 'react';
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
};

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = '/login';
        return;
      }
      setSession(data.session);
      fetchTodos(data.session.user.id);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!s) window.location.href = '/login';
      else {
        setSession(s);
        fetchTodos(s.user.id);
      }
    });

    return () => listener.subscription?.unsubscribe();
  }, []);

  const fetchTodos = async (userId: string) => {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setTodos(data || []);
    setLoading(false);
  };

  const addTodo = async ({ title, description }: { title: string; description?: string }) => {
    if (!session) return;
    const { data } = await supabase
      .from('todos')
      .insert({ user_id: session.user.id, title, description })
      .select()
      .single();
    if (data) setTodos(prev => [data, ...prev]);
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const { data } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (data) setTodos(prev => prev.map(todo => (todo.id === id ? data : todo)));
  };

  const deleteTodo = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id);
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <p>Loading...</p>
      </div>
    );

  if (!session) return null;

  // Filter todos for each tab
  const today = new Date().toISOString().split('T')[0];
  const todayTodos = todos.filter(todo => todo.created_at.startsWith(today));
  const completedTodos = todos.filter(todo => todo.is_complete);
  const pendingTodos = todos.filter(todo => !todo.is_complete);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">My Todo Dashboard</h1>
        <TodoForm onAdd={addTodo} />

        <Tabs.Root defaultValue="today" className="mt-6">
          <Tabs.List className="flex space-x-2 border-b border-purple-100">
            <Tabs.Trigger
              value="today"
              className="px-4 py-2 text-sm font-medium text-purple-200 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:font-semibold"
            >
              Today&apos;s Todos ({todayTodos.length})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="completed"
              className="px-4 py-2 text-sm font-medium text-purple-200 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:font-semibold"
            >
              Completed ({completedTodos.length})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="pending"
              className="px-4 py-2 text-sm font-medium text-purple-200 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:font-semibold"
            >
              Pending ({pendingTodos.length})
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="today" className="mt-4 space-y-4">
            {todayTodos.length === 0 && <p className="text-purple-300">No todos for today.</p>}
            {todayTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
            ))}
          </Tabs.Content>

          <Tabs.Content value="completed" className="mt-4 space-y-4">
            {completedTodos.length === 0 && <p className="text-purple-300">No completed todos.</p>}
            {completedTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
            ))}
          </Tabs.Content>

          <Tabs.Content value="pending" className="mt-4 space-y-4">
            {pendingTodos.length === 0 && <p className="text-purple-300">No pending todos.</p>}
            {pendingTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
            ))}
          </Tabs.Content>
        </Tabs.Root>

      </div>
    </div>
  );
}
