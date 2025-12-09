'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function WelcomePage() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-purple-800 to-black transition-colors relative overflow-hidden">
      <div className="absolute top-6 right-6 cursor-pointer z-50" onClick={toggleTheme}>
        {darkMode ? (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        ) : (
          <MoonIcon className="w-6 h-6 text-white" />
        )}
      </div>

      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between p-8 gap-10 z-10">
        <div className="flex-1 space-y-6">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400">
            TO-DO <span className="text-blue-400">LIST</span>
          </h1>
          <p className="text-lg max-w-md text-gray-200">
            Your personal productivity companion! Organize your tasks, track your progress, and achieve your goals effortlessly.
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/signup" className="px-6 py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold transition shadow-lg">
              Signup
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-lg border border-gray-400 hover:bg-gray-800 text-gray-200 font-semibold transition shadow-lg">
              Login
            </Link>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="w-full h-96 md:h-[28rem] rounded-3xl shadow-xl flex items-center justify-center overflow-hidden bg-purple-900/40 backdrop-blur-lg border border-purple-600">
            <img
              src="https://plus.unsplash.com/premium_photo-1681487867978-1b83ce2625c5?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Todo Illustration"
              className="w-full h-full object-cover"
            />
          </div>



        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-purple-600 opacity-30 blur-3xl animate-blob" style={{ top: '-10%', left: '5%' }}></div>
        <div className="absolute w-72 h-72 rounded-full bg-pink-500 opacity-30 blur-2xl animate-blob animation-delay-2000" style={{ bottom: '10%', right: '10%' }}></div>
        <div className="absolute w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-3xl animate-blob animation-delay-4000" style={{ top: '20%', right: '20%' }}></div>
      </div>
    </div>
  );
}
