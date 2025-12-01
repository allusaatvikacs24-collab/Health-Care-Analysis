import { useState } from 'react';
import { X, Key, Eye, EyeOff } from 'lucide-react';
import { apiKeyService } from '../services/apiKeyService';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!apiKeyService.validateApiKey(apiKey)) {
      setError('Invalid API key format. Must be at least 20 characters with alphanumeric characters, hyphens, or underscores.');
      return;
    }

    apiKeyService.setApiKey(apiKey);
    onSave(apiKey);
    setApiKey('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="dark:bg-slate-800 bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 dark:text-blue-400 text-blue-600" />
            <h2 className="text-lg font-semibold dark:text-white text-slate-900">API Key Setup</h2>
          </div>
          <button onClick={onClose} className="dark:text-gray-400 text-slate-600 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm dark:text-gray-300 text-slate-600 mb-4">
          Enter your health data API key to access real-time analytics and insights.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-slate-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg px-3 py-2 pr-10 dark:text-white text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 dark:text-gray-400 text-slate-600 hover:text-blue-500"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 dark:bg-slate-600 bg-slate-200 dark:text-white text-slate-900 py-2 px-4 rounded-lg hover:opacity-80 transition-opacity"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}