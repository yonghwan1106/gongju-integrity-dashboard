import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-yellow-500" />
          <span className="text-sm hidden sm:inline text-gray-700 dark:text-gray-300">
            라이트
          </span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-blue-600" />
          <span className="text-sm hidden sm:inline text-gray-700 dark:text-gray-300">
            다크
          </span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;