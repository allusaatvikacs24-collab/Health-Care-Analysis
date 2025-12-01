import { useState } from 'react';
import { User, Save } from 'lucide-react';

export default function ProfileSetup({ onProfileSave }) {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    role: 'User',
    email: '',
    department: 'General',
    goals: ''
  });

  const handleSave = () => {
    if (profile.name && profile.email) {
      const userProfile = {
        ...profile,
        age: parseInt(profile.age) || 25,
        lastLogin: new Date().toLocaleDateString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      onProfileSave(userProfile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 bg-gray-50">
      <div className="dark:bg-slate-800 bg-white rounded-xl p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold dark:text-white text-slate-900">Create Your Profile</h1>
          <p className="dark:text-gray-400 text-slate-600 mt-2">Set up your health dashboard profile</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-slate-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              placeholder="Enter your full name"
              className="w-full dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg px-3 py-2 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-slate-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              placeholder="Enter your email"
              className="w-full dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg px-3 py-2 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-slate-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({...profile, age: e.target.value})}
              placeholder="Enter your age"
              className="w-full dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg px-3 py-2 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-slate-700 mb-2">
              Role
            </label>
            <select
              value={profile.role}
              onChange={(e) => setProfile({...profile, role: e.target.value})}
              className="w-full dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg px-3 py-2 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="User">User</option>
              <option value="Health Administrator">Health Administrator</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Patient">Patient</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-slate-700 mb-2">
              Health Goals
            </label>
            <textarea
              value={profile.goals}
              onChange={(e) => setProfile({...profile, goals: e.target.value})}
              placeholder="What are your health goals?"
              rows={3}
              className="w-full dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg px-3 py-2 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!profile.name || !profile.email}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Create Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}