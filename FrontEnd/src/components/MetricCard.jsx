import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, icon: Icon, color = 'blue' }) {
  const isPositive = change > 0;
  const colorClasses = {
    blue: 'dark:border-blue-500/50 border-blue-300',
    purple: 'dark:border-purple-500/50 border-purple-300',
    green: 'dark:border-green-500/50 border-green-300'
  };

  const iconColors = {
    blue: 'dark:text-blue-400 text-blue-600',
    purple: 'dark:text-purple-400 text-purple-600',
    green: 'dark:text-green-400 text-green-600'
  };

  return (
    <div className={`dark:bg-slate-800/50 bg-white border ${colorClasses[color]} rounded-xl p-6 transition-all duration-300 hover:scale-105 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color === 'blue' ? 'dark:bg-blue-500/20 bg-blue-100' : color === 'purple' ? 'dark:bg-purple-500/20 bg-purple-100' : 'dark:bg-green-500/20 bg-green-100'}`}>
          <Icon className={`w-6 h-6 ${iconColors[color]}`} />
        </div>
        <div className="flex items-center space-x-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 dark:text-green-400 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${isPositive ? 'dark:text-green-400 text-green-600' : 'text-red-500'}`}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <h3 className="dark:text-gray-400 text-slate-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold dark:text-white text-slate-900 mt-1">{value.toLocaleString()}</p>
    </div>
  );
}