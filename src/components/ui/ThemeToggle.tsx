import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="切换主题"
    >
      <motion.div
        className="absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-primary shadow-md flex items-center justify-center"
        animate={{ left: theme === 'dark' ? 28 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? <Moon size={14} className="text-white" /> : <Sun size={14} className="text-yellow-500" />}
      </motion.div>
    </button>
  );
}
