'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';

type Todo = {
  id: string;
  title: string;
  description?: string;
  is_complete: boolean;
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
    const { data } = await supabase.from('todos').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setTodos(data || []);
    setLoading(false);
  };

  const addTodo = async ({ title, description }: { title: string; description?: string }) => {
    if (!session) return;
    const { data } = await supabase.from('todos').insert({ user_id: session.user.id, title, description }).select().single();
    if (data) setTodos(prev => [data, ...prev]);
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const { data } = await supabase.from('todos').update(updates).eq('id', id).select().single();
    if (data) setTodos(prev => prev.map(todo => (todo.id === id ? data : todo)));
  };

  const deleteTodo = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id);
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-white"><p className="text-gray-700">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">My Todo Dashboard</h1>
        <TodoForm onAdd={addTodo} />
        <div className="mt-6 space-y-4">
          {todos.length === 0 && <p className="text-gray-500">No todos yet.</p>}
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
          ))}
        </div>
      </div>
    </div>
  );
}
