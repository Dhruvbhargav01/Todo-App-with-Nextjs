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
    setSaving(true);
    await onUpdate(todo.id, { title, description: desc });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl flex items-start justify-between shadow-md border border-white/30">
      <div className="flex-1">
        <div className="flex items-start gap-3">
          {/* <input type="checkbox" checked={todo.is_complete} onChange={toggleComplete} /> */}
          <div className="flex-1">
            {!editing ? (
              <>
                <div className={`text-lg font-medium ${todo.is_complete ? 'line-through opacity-60' : ''}`}>
                  {todo.title}
                </div>
                {todo.description && <div className="text-sm text-slate-600">{todo.description}</div>}
              </>
            ) : (
              <div className="space-y-2">
                {/* <input
                  className="w-full p-2 border rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                /> */}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {!editing ? (
          <>
            <button onClick={() => setEditing(true)} className="px-3 py-1 rounded border">
              Edit
            </button>
            {/* <button onClick={() => onDelete(todo.id)} className="px-3 py-1 rounded border">
              <FaTrash />
            </button> */}
          </>
        ) : (
          <>
            <button
              onClick={save}
              disabled={saving}
              className="px-3 py-1 rounded bg-indigo-600 text-white"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 rounded border">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
