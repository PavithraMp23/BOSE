import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Button } from './ui/button';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      className="relative h-9 w-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
    >
      <div className="relative w-full h-full flex items-center">
        <Sun
          size={16}
          className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            darkMode ? 'opacity-0 scale-0' : 'opacity-100 scale-100 text-yellow-500'
          }`}
        />
        <Moon
          size={16}
          className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            darkMode ? 'opacity-100 scale-100 text-blue-400' : 'opacity-0 scale-0'
          }`}
        />
        <span
          className={`absolute top-1 h-7 w-7 rounded-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ${
            darkMode ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </div>
    </Button>
  );
}

