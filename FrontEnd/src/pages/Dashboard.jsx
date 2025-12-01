import { useState, useEffect } from 'react';
import { Users, UserCheck, Heart, Activity, RefreshCw, Droplets, Moon } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import LineChartCard from '../components/LineChartCard';
import PieChartCard from '../components/PieChartCard';
import DataTable from '../components/DataTable';
import AIInsightCard from '../components/AIInsightCard';
import Loader from '../components/Loader';
import { api } from '../services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [waterData, setWaterData] = useState(null);
  const [heartRateData, setHeartRateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [metricsRes, trendsRes, diseaseRes] = await Promise.all([
        api.getMetrics(),
        api.getTrendData(),
        api.getDiseaseData()
      ]);
      
      console.log('Dashboard data loaded:', { metricsRes, trendsRes, diseaseRes });
      
      // Set data from API response
      setMetrics(metricsRes);
      setTrendData(trendsRes);
      setDiseaseData(diseaseRes);
      
      // Try to get water and heart rate data if available
      try {
        const [waterRes, heartRateRes] = await Promise.all([
          api.getWaterData?.() || Promise.resolve([]),
          api.getHeartRateData?.() || Promise.resolve([])
        ]);
        
        setWaterData(waterRes);
        setHeartRateData(heartRateRes);
      } catch (error) {
        console.log('Water/heart rate data not available:', error);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Listen for data updates from uploads
    const handleDataUpdate = (event) => {
      console.log('Data updated event received:', event.detail);
      if (event.detail) {
        const { metrics: newMetrics, trendData: newTrends, diseaseData: newDisease } = event.detail;
        if (newMetrics) setMetrics(newMetrics);
        if (newTrends) setTrendData(newTrends);
        if (newDisease) setDiseaseData(newDisease);
      }
      fetchData();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white text-slate-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 dark:bg-blue-600/20 bg-blue-100 dark:border-blue-500/30 border-blue-300 dark:text-blue-400 text-blue-700 px-4 py-2 rounded-lg dark:hover:bg-blue-600/30 hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
          <div className="text-sm dark:text-gray-400 text-slate-600">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics?.totalPatients || 12847}
          change={0}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Avg Steps"
          value={(metrics?.avgSteps || 8420).toLocaleString()}
          change={metrics?.stepsChange || 5.4}
          icon={Activity}
          color="green"
        />
        <MetricCard
          title="Avg Heart Rate"
          value={`${metrics?.avgHeartRate || 72} bpm`}
          change={metrics?.heartRateChange || -2.1}
          icon={Heart}
          color="red"
        />
        <MetricCard
          title="Avg Sleep"
          value={`${metrics?.avgSleep || 7.2}h`}
          change={metrics?.sleepChange || 8.3}
          icon={Moon}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="Daily Steps Trend"
          data={trendData || [
            { month: 'Jan', patients: 1200 },
            { month: 'Feb', patients: 1350 },
            { month: 'Mar', patients: 1180 },
            { month: 'Apr', patients: 1420 },
            { month: 'May', patients: 1380 },
            { month: 'Jun', patients: 1520 }
          ]}
          dataKey="patients"
          color="#00D4FF"
        />
        <PieChartCard
          title="Wellness Overview"
          data={diseaseData || [
            { name: 'Excellent', value: 35, color: '#00FF88' },
            { name: 'Good', value: 28, color: '#00D4FF' },
            { name: 'Fair', value: 22, color: '#8B5CF6' },
            { name: 'Poor', value: 15, color: '#FF6B6B' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="Water Intake Trend"
          data={waterData || [
            { date: 'Mon', value: 2.1 },
            { date: 'Tue', value: 2.3 },
            { date: 'Wed', value: 1.9 },
            { date: 'Thu', value: 2.5 },
            { date: 'Fri', value: 2.2 },
            { date: 'Sat', value: 2.4 },
            { date: 'Sun', value: 2.0 }
          ]}
          dataKey="value"
          color="#00D4FF"
        />
        <LineChartCard
          title="Heart Rate Trend"
          data={heartRateData || [
            { date: 'Mon', value: 72 },
            { date: 'Tue', value: 74 },
            { date: 'Wed', value: 71 },
            { date: 'Thu', value: 75 },
            { date: 'Fri', value: 73 },
            { date: 'Sat', value: 70 },
            { date: 'Sun', value: 72 }
          ]}
          dataKey="value"
          color="#FF6B6B"
        />
      </div>

      <AIInsightCard 
        healthData={metrics || { totalPatients: 12847, avgSteps: 8420, avgHeartRate: 72, avgSleep: 7.2 }}
        title="AI Health Dashboard Analysis"
      />

      <DataTable
        title="Health Metrics Summary"
        data={[
          { metric: 'Average Steps', value: (metrics?.avgSteps || 8420).toLocaleString(), status: 'Good', trend: '+5%' },
          { metric: 'Heart Rate', value: `${metrics?.avgHeartRate || 72} bpm`, status: 'Normal', trend: '-2%' },
          { metric: 'Sleep Hours', value: `${metrics?.avgSleep || 7.2}h`, status: 'Fair', trend: '+8%' },
          { metric: 'Active Users', value: (metrics?.totalPatients || 12847).toLocaleString(), status: 'Growing', trend: '+12%' }
        ]}
        columns={[
          { header: 'Health Metric', accessor: 'metric' },
          { header: 'Current Value', accessor: 'value' },
          { header: 'Status', accessor: 'status' },
          { header: 'Trend', accessor: 'trend' }
        ]}
      />
    </div>
  );
}