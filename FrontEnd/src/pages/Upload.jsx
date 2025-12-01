import { useState } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { api } from '../services/api';
import PieChartCard from '../components/PieChartCard';

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file.name.endsWith('.csv')) {
      setUploadResult({ success: false, message: 'Please upload a CSV file only.' });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const result = await api.uploadFile(file);
      setUploadResult(result);
      if (result.success && result.data) {
        setUploadedData(result.data);
      }
    } catch (error) {
      setUploadResult({ success: false, message: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white text-slate-900">Upload Health Data</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700 border-slate-300 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold dark:text-white text-slate-900 mb-6">Upload CSV File</h2>
          
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'dark:border-blue-400 border-blue-500 dark:bg-blue-500/10 bg-blue-50' 
                : 'dark:border-slate-600 border-slate-400 dark:hover:border-slate-500 hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            
            <div className="space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                uploading ? 'dark:bg-blue-500/20 bg-blue-100 animate-pulse' : 'dark:bg-slate-700 bg-slate-200'
              }`}>
                <UploadIcon className={`w-8 h-8 ${uploading ? 'dark:text-blue-400 text-blue-600 animate-bounce' : 'dark:text-gray-400 text-slate-600'}`} />
              </div>
              
              <div>
                <p className="text-lg font-medium dark:text-white text-slate-900">
                  {uploading ? 'Uploading...' : 'Drop your CSV file here'}
                </p>
                <p className="dark:text-gray-400 text-slate-900 mt-1">
                  or click to browse files
                </p>
              </div>
              
              <button
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
              >
                {uploading ? 'Processing...' : 'Select File'}
              </button>
            </div>
          </div>

          {uploadResult && (
            <div className={`mt-6 p-4 rounded-lg border ${
              uploadResult.success 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center space-x-2">
                {uploadResult.success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {uploadResult.success ? 'Success!' : 'Error!'}
                </span>
              </div>
              <p className="mt-1 text-sm">{uploadResult.message}</p>
              {uploadResult.fileName && (
                <p className="mt-1 text-xs opacity-75">File: {uploadResult.fileName}</p>
              )}
              {uploadResult.data_id && (
                <p className="mt-1 text-xs opacity-75">Data ID: {uploadResult.data_id}</p>
              )}
            </div>
          )}
        </div>

        <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700 border-slate-300 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold dark:text-white text-slate-900 mb-6">File Requirements</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 dark:text-blue-400 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium dark:text-white text-slate-900">CSV Format</h3>
                <p className="text-sm dark:text-gray-400 text-slate-600">Files must be in CSV format with proper headers</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 dark:text-green-400 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium dark:text-white text-slate-900">Required Columns</h3>
                <p className="text-sm dark:text-gray-400 text-slate-600">steps, heart_rate, sleep_hours, hydration_liters, calories_burned</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <UploadIcon className="w-5 h-5 dark:text-purple-400 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium dark:text-white text-slate-900">File Size</h3>
                <p className="text-sm dark:text-gray-400 text-slate-600">Maximum file size: 10MB</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 dark:bg-blue-500/10 bg-blue-50 border dark:border-blue-500/30 border-blue-300 rounded-lg">
            <h4 className="dark:text-blue-400 text-blue-700 font-medium mb-2">Sample Data Format</h4>
            <pre className="text-xs dark:text-gray-300 text-slate-700 overflow-x-auto">
{`steps,heart_rate,sleep_hours,hydration_liters,calories_burned
8500,72,7.5,2.2,2100
9200,75,6.8,1.9,2300
7800,70,8.1,2.5,1950`}
            </pre>
          </div>
        </div>
      </div>

      {uploadedData && (
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-bold text-white">Uploaded Data Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-gradient border border-neon-blue/30 rounded-lg p-4">
              <h3 className="text-neon-blue font-semibold">Total Records</h3>
              <p className="text-2xl font-bold dark:text-white text-slate-900">{uploadedData.metrics.totalPatients}</p>
            </div>
            <div className="card-gradient border border-neon-green/30 rounded-lg p-4">
              <h3 className="text-neon-green font-semibold">Avg Steps/Day</h3>
              <p className="text-2xl font-bold dark:text-white text-slate-900">{uploadedData.metrics.avgSteps?.toLocaleString()}</p>
            </div>
            <div className="card-gradient border border-neon-purple/30 rounded-lg p-4">
              <h3 className="text-neon-purple font-semibold">Avg Heart Rate</h3>
              <p className="text-2xl font-bold dark:text-white text-slate-900">{uploadedData.metrics.avgHeartRate} BPM</p>
            </div>
            <div className="card-gradient border border-yellow-500/30 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold">Avg Sleep</h3>
              <p className="text-2xl font-bold dark:text-white text-slate-900">{uploadedData.metrics.avgSleep}h</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="card-gradient border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold">Active Users</h3>
              <p className="text-2xl font-bold dark:text-white text-slate-900">{uploadedData.metrics.activePatients}</p>
              <p className="text-sm text-gray-400">6000+ steps/day</p>
            </div>
            <div className="card-gradient border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold">Avg Calories</h3>
              <p className="text-2xl font-bold dark:text-white text-slate-900">{uploadedData.metrics.avgCalories?.toLocaleString()}</p>
              <p className="text-sm text-gray-400">per day</p>
            </div>
            <div className="card-gradient border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold">Health Alerts</h3>
              <p className="text-2xl font-bold dark:text-white text-slate-900">{uploadedData.metrics.criticalCases}</p>
              <p className="text-sm text-gray-400">need attention</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChartCard
              title="Health Status Distribution"
              data={uploadedData.healthData}
            />
            
            <div className="card-gradient border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-4">Sample Records</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-600 border-slate-400">
                      {uploadedData.rawData[0] && Object.keys(uploadedData.rawData[0]).map(key => (
                        <th key={key} className="text-left py-2 px-3 dark:text-gray-300 text-slate-900">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.rawData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b dark:border-gray-700/50 border-slate-300/50">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="py-2 px-3 dark:text-gray-300 text-slate-900">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {uploadedData.rawData.length > 5 && (
                <p className="dark:text-gray-400 text-slate-700 text-xs mt-2">
                  Showing 5 of {uploadedData.rawData.length} records
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}