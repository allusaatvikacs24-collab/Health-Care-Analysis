import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function PieChartCard({ title, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700 border-slate-300 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-6">{title}</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="dark:text-gray-400 text-slate-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700 border-slate-300 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-6">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #1F2937)',
                border: '1px solid var(--tooltip-border, #374151)',
                borderRadius: '8px',
                color: 'var(--tooltip-text, #fff)'
              }}
            />
            <Legend 
              wrapperStyle={{ color: 'var(--legend-text, #374151)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}