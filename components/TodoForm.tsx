'use client';
import React, { useState } from 'react';

export default function TodoForm({ onAdd }: { onAdd: (payload: any) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New todo title" className="flex-1 p-3 rounded-md border" />
        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Add</button>
      </div>
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" className="w-full p-3 rounded-md border" />
    </form>
  );
}
