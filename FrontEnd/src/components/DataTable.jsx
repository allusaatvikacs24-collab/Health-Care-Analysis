export default function DataTable({ title, data, columns }) {
  if (!data || data.length === 0) {
    return (
      <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700 border-slate-300 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-6">{title}</h3>
        <div className="text-center py-8">
          <p className="dark:text-gray-400 text-slate-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700 border-slate-300 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-6">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-slate-600 border-slate-300">
              {columns.map((column, index) => (
                <th key={index} className="text-left py-3 px-4 font-semibold dark:text-gray-300 text-slate-700">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b dark:border-slate-700 border-slate-200 hover:dark:bg-slate-700/50 hover:bg-slate-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-3 px-4 dark:text-gray-300 text-slate-700">
                    {column.accessor ? row[column.accessor] : column.render ? column.render(row) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}