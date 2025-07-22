'use client';
import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // const page = document.querySelector(".page");
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const resolvedTheme = storedTheme ?? (systemPrefersDark ? 'dark' : 'light');
    setTheme(resolvedTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    // if (storedTheme) {
    //   setTheme(storedTheme);
    //   (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    //   document.documentElement.classList.add('dark');
    //   page?.classList.toggle('dark', storedTheme === 'dark');
    // } else {
    //   setTheme('light');
    //   document.documentElement.classList.remove('dark')
      
      // page?.classList.remove('dark');
    // }
  }, []);

  const toggleTheme = () => {
    // const page = document.querySelector(".page");
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark'); // Toggle dark mode class

    // page?.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer z-56">
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        className="sr-only peer"
      />
      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-gray-700 transition-colors duration-300 relative">
        <div className={`absolute top-[4px] left-[4px] h-6 w-6 rounded-full bg-yellow-500 dark:bg-gray-400 flex items-center justify-center text-sm transition-all duration-300 shadow
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0 '}`}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
      </div>
      <span className="ml-3 text-sm font-medium text-black dark:text-white">
        {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
      </span>
    </label>
  );
};

export default DarkModeToggle;
