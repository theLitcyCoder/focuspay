'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { logout } from '@/lib/logout';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null); // Clear user state
    router.push('/auth/signin');
  };

  return (
    <header className="w-full p-4 flex justify-between items-center bg-white dark:bg-gray-900 shadow-md">
      <h1 className="text-2xl font-bold text-black dark:text-white"><a href="/">FocusPay </a></h1>
      <div className="flex gap-6 items-center">
        <DarkModeToggle />
        {user && (
          <button
            onClick={handleLogout}
            className="z-56 px-4 py-2 rounded cursor-pointer bg-red-700 hover:bg-red-600 text-white"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

