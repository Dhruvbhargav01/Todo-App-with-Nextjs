'use client';

import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

type Todo = {
  id: string;
  title: string;
  description?: string;
  is_complete: boolean;
};

export default function TodoItem({
  todo,
  onUpdate,
  onDelete,
}: {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [desc, setDesc] = useState(todo.description || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(todo.title);
    setDesc(todo.description || '');
  }, [todo]);

  const toggleComplete = async () => {
    await onUpdate(todo.id, { is_complete: !todo.is_complete });
  };

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onUpdate(todo.id, { title, description: desc });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="bg-white dark:bg-blue-900/20 p-4 rounded-xl flex items-start justify-between shadow-md border border-gray-200 dark:border-blue-800 transition">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={todo.is_complete}
            onChange={toggleComplete}
            className="w-5 h-5 accent-indigo-600"
          />
          {!editing ? (
            <div className="flex flex-col">
              <span className={`text-lg font-medium ${todo.is_complete ? 'line-through opacity-60' : ''}`}>
                {todo.title}
              </span>
              {todo.description && (
                <span className="text-sm text-gray-600 dark:text-gray-300">{todo.description}</span>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2 flex-1">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-blue-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-blue-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {!editing ? (
          <>
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-blue-700 hover:bg-gray-100 dark:hover:bg-blue-800 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-100 dark:hover:bg-red-800 transition flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={save}
              disabled={saving}
              className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-blue-700 hover:bg-gray-100 dark:hover:bg-blue-800 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

