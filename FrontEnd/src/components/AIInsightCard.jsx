import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { geminiService } from '../services/geminiService';

export default function AIInsightCard({ healthData, title = "AI Health Insights" }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const aiResponse = await geminiService.generateHealthInsights(healthData);
      setInsight(aiResponse);
    } catch (error) {
      console.error('AI insight error:', error);
      setInsight('AI insights temporarily unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700 border-slate-300 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 dark:text-blue-400 text-blue-600" />
          <h3 className="text-xl font-semibold dark:text-white text-slate-900">{title}</h3>
        </div>
        <button
          onClick={generateInsight}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Generate AI Insights'}</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center space-x-2 dark:text-gray-400 text-slate-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span>AI is analyzing your health data...</span>
        </div>
      ) : insight ? (
        <div className="dark:text-gray-300 text-slate-700 leading-relaxed">
          {insight}
        </div>
      ) : (
        <div className="dark:text-gray-400 text-slate-600">
          Click "Generate AI Insights" to get personalized health recommendations based on your data.
        </div>
      )}
    </div>
  );
}