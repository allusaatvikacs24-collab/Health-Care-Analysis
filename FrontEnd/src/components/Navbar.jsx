import { Bell, Sun, Moon } from 'lucide-react';
import SearchBar from './SearchBar';
import UserDropdown from './UserDropdown';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onSearch }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <nav className="dark:bg-blue-950/70 bg-white/95 backdrop-blur-sm border-b dark:border-blue-900 border-slate-300 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Health Data Analysis Agent
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search patients, diagnoses..."
            />
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 dark:text-gray-400 text-slate-900 hover:text-blue-600 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="relative p-2 dark:text-gray-400 text-slate-900 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
}