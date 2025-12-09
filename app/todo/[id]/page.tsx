'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '../../../components/GlassCard';
import { supabase } from '@/lib/supabaseClient';

type Todo = {
  id: string;
  title: string;
  description?: string;
  is_complete: boolean;
};

export default function TodoPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error(error.message);
      } else {
        setTodo(data);
      }
      setLoading(false);
    };
    fetchTodo();
  }, [id]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;
    const { error } = await supabase.from('todos').update(todo).eq('id', todo.id);
    if (error) {
      console.error(error.message);
    } else {
      router.back();
    }
  };

  if (loading || !todo) return <div className="p-6 text-gray-700">Loading...</div>;

  return (
    <div className="flex justify-center mt-10 px-4">
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Edit Todo</h2>
        <form onSubmit={onSave} className="space-y-4">
          <input
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
            className="w-full p-3 rounded-md border"
            placeholder="Title"
            required
          />
          <textarea
            value={todo.description || ''}
            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
            className="w-full p-3 rounded-md border"
            placeholder="Description (optional)"
          />
          <label className="flex items-center gap-2 text-gray-900">
            <input
              type="checkbox"
              checked={todo.is_complete}
              onChange={(e) => setTodo({ ...todo, is_complete: e.target.checked })}
            />
            Completed
          </label>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Save
            </button>
            <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded border">
              Cancel
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
