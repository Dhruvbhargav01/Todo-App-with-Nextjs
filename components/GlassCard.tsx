import React from 'react';

export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/30 dark:bg-blue-900/30 backdrop-blur-md p-6 rounded-2xl border border-white/40 dark:border-blue-700/50 shadow-md">
      {children}
    </div>
  );
}
