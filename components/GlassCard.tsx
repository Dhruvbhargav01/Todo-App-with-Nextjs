import React from 'react';

export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass p-6 rounded-2xl border border-white/40">
      {children}
    </div>
  );
}
