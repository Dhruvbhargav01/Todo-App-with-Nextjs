'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import GlassCard from '../../../components/GlassCard';

export default function TodoPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [todo, setTodo] = useState<{ title: string; description: string; is_complete: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      const { data, error } = await supabase.from('todos').select('*').eq('id', id).single();
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setTodo({
        title: data.title || '',
        description: data.description || '',
        is_complete: data.is_complete || false,
      });
      setLoading(false);
    };
    fetchTodo();
  }, [id]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;
    await supabase
      .from('todos')
      .update({ title: todo.title, description: todo.description, is_complete: todo.is_complete })
      .eq('id', id);
    router.back();
  };

  if (loading || !todo) return <div>Loading...</div>;

  return (
    <GlassCard>
      <h2 className="text-xl font-semibold mb-3">Edit Todo</h2>
      <form onSubmit={onSave} className="space-y-3">
        {/* <input
          value={todo.title}
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          className="w-full p-3 rounded-md border"
        />
        <textarea
          value={todo.description}
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          className="w-full p-3 rounded-md border"
        /> */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todo.is_complete}
            onChange={(e) => setTodo({ ...todo, is_complete: e.target.checked })}
          />
          Completed
        </label>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">
            Save
          </button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded border">
            Cancel
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
