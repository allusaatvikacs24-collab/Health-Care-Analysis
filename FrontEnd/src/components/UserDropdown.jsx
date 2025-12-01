import { useState, useEffect } from 'react';
import { User, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTheme } from '../context/ThemeContext';
import ProfileSetup from './ProfileSetup';

export default function UserDropdown() {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const { isDark } = useTheme();
  
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserInfo(JSON.parse(savedProfile));
    } else {
      setShowProfileSetup(true);
    }
  }, []);
  
  const handleProfileSave = (profile) => {
    setUserInfo(profile);
    setShowProfileSetup(false);
  };
  
  if (showProfileSetup) {
    return <ProfileSetup onProfileSave={handleProfileSave} />;
  }
  
  if (!userInfo) {
    return null;
  }

  const dropdown = showUserInfo ? createPortal(
    <>
      <div className="fixed inset-0 z-[99999] bg-black/20" onClick={() => setShowUserInfo(false)}></div>
      <div className="fixed top-16 right-6 z-[99999] w-80 dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 rounded-lg shadow-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold dark:text-white text-slate-900">User Information</h3>
          <button 
            onClick={() => setShowUserInfo(false)}
            className="dark:text-gray-400 text-slate-600 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold dark:text-white text-slate-900">{userInfo.name}</p>
              <p className="text-sm dark:text-gray-400 text-slate-600">{userInfo.role}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="dark:text-gray-400 text-slate-600">Age</p>
              <p className="dark:text-white text-slate-900 font-medium">{userInfo.age} years</p>
            </div>
            <div>
              <p className="dark:text-gray-400 text-slate-600">Goals</p>
              <p className="dark:text-white text-slate-900 font-medium">{userInfo.goals || 'Not set'}</p>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="dark:text-gray-400 text-slate-600">Email</p>
            <p className="dark:text-white text-slate-900 font-medium">{userInfo.email}</p>
          </div>
          
          <div className="text-sm">
            <p className="dark:text-gray-400 text-slate-600">Last Login</p>
            <p className="dark:text-white text-slate-900 font-medium">{userInfo.lastLogin}</p>
          </div>
          
          <div className="pt-3 border-t dark:border-slate-700 border-slate-200">
            <button 
              onClick={() => {
                // Clear all stored data
                localStorage.clear();
                // Reload the page to reset the application
                window.location.reload();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      <button 
        onClick={() => setShowUserInfo(!showUserInfo)}
        className="flex items-center space-x-2 dark:bg-blue-900/50 bg-slate-200/70 rounded-lg px-3 py-2 dark:hover:bg-blue-800/50 hover:bg-slate-300/70 transition-colors"
      >
        <User className="w-4 h-4 dark:text-gray-400 text-slate-900" />
        <span className="text-sm dark:text-gray-300 text-slate-900">{userInfo?.name?.split(' ')[0] || 'User'}</span>
      </button>
      {dropdown}
    </>
  );
}