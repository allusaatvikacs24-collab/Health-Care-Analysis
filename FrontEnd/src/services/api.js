import { mockMetrics, mockTrendData, mockDiseaseData, mockAgeGroups, mockInsights, generateRandomData, parseCSVData, mockForecastData, mockRiskData, mockWeeklyData, mockHabits, mockSleepQuality, mockChatResponses } from './mockData.js';
import { apiKeyService } from './apiKeyService.js';
import { geminiService } from './geminiService.js';

const API_BASE_URL = 'http://localhost:8000';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create authenticated headers
const getAuthHeaders = () => {
  const apiKey = apiKeyService.getApiKey();
  return {
    'Content-Type': 'application/json',
    ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
  };
};

// Load saved data from localStorage
const loadSavedData = () => {
  try {
    const saved = localStorage.getItem('healthData');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading saved data:', error);
    return null;
  }
};

let currentData = loadSavedData() || {
  metrics: mockMetrics,
  trendData: mockTrendData,
  diseaseData: mockDiseaseData,
  ageGroups: mockAgeGroups,
  insights: mockInsights,
  searchResults: [],
  waterData: [
    { date: 'Mon', value: 2.1 },
    { date: 'Tue', value: 2.3 },
    { date: 'Wed', value: 1.9 },
    { date: 'Thu', value: 2.5 },
    { date: 'Fri', value: 2.2 },
    { date: 'Sat', value: 2.4 },
    { date: 'Sun', value: 2.0 }
  ],
  heartRateData: [
    { date: 'Mon', value: 72 },
    { date: 'Tue', value: 74 },
    { date: 'Wed', value: 71 },
    { date: 'Thu', value: 75 },
    { date: 'Fri', value: 73 },
    { date: 'Sat', value: 70 },
    { date: 'Sun', value: 72 }
  ],
  currentDataId: null,
  previousUserCount: 0
};

export const updateData = (newData) => {
  currentData = { ...currentData, ...newData };
  localStorage.setItem('healthData', JSON.stringify(currentData));
};

export const getCurrentData = () => currentData;

export const api = {
  async getMetrics() {
    await delay(500);
    return currentData.metrics;
  },

  async getTrendData() {
    await delay(700);
    return currentData.trendData;
  },

  async getDiseaseData() {
    await delay(600);
    return currentData.diseaseData;
  },

  async getAgeGroups() {
    await delay(550);
    return currentData.ageGroups;
  },

  async getInsights() {
    await delay(400);
    return currentData.insights;
  },

  async refreshData() {
    await delay(1000);
    return currentData;
  },

  async uploadFile(file) {
    await delay(1000);
    try {
      const text = await file.text();
      const parsedData = parseCSVData(text);
      
      console.log('Parsed CSV data:', parsedData);
      
      // Update all data with parsed CSV data
      currentData.metrics = parsedData.metrics;
      currentData.trendData = parsedData.trendData;
      currentData.diseaseData = parsedData.healthData;
      currentData.waterData = parsedData.waterData;
      currentData.heartRateData = parsedData.heartRateData;
      
      // Save to localStorage for persistence
      localStorage.setItem('healthData', JSON.stringify(currentData));
      
      // Generate AI insights using Gemini
      let aiInsight = '';
      try {
        aiInsight = await geminiService.generateHealthInsights(parsedData.metrics);
      } catch (error) {
        console.error('AI insight generation failed:', error);
        aiInsight = 'AI analysis temporarily unavailable. Your data has been processed successfully.';
      }
      
      const insights = [
        {
          id: Date.now(),
          type: 'success',
          title: 'CSV Data Uploaded Successfully',
          description: `Processed ${parsedData.metrics.totalPatients} health records. Average steps: ${parsedData.metrics.avgSteps}/day`,
          timestamp: 'Just now'
        },
        {
          id: Date.now() + 1,
          type: 'info',
          title: 'AI Health Analysis',
          description: aiInsight,
          timestamp: 'Just now'
        },
        {
          id: Date.now() + 2,
          type: parsedData.metrics.criticalCases > 0 ? 'warning' : 'success',
          title: 'Health Assessment Complete',
          description: parsedData.metrics.criticalCases > 0 ? 
            `Found ${parsedData.metrics.criticalCases} cases requiring attention` :
            'All health metrics within normal ranges',
          timestamp: 'Just now'
        }
      ];
      currentData.insights = [...insights, ...currentData.insights.slice(0, 1)];
      
      // Trigger live updates
      window.dispatchEvent(new CustomEvent('dataUpdated', { detail: currentData }));
      
      return { 
        success: true, 
        message: `Successfully processed ${parsedData.metrics.totalPatients} health records from ${file.name}`, 
        fileName: file.name,
        data: parsedData
      };
    } catch (error) {
      console.error('CSV processing error:', error);
      throw new Error(`Failed to process CSV file: ${error.message}. Please ensure your CSV has the correct format with headers: steps, heart_rate, sleep_hours, hydration_liters`);
    }
  },

  async searchData(query) {
    await delay(300);
    if (!query) {
      currentData.searchResults = [];
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    let results = [];
    
    // Search insights
    const insightResults = currentData.insights.filter(insight => 
      insight.title.toLowerCase().includes(lowerQuery) ||
      insight.description.toLowerCase().includes(lowerQuery)
    );
    
    // Search health metrics
    if (lowerQuery.includes('steps') || lowerQuery.includes('walk')) {
      results.push({
        id: 'metric-steps',
        title: 'Daily Steps Analysis',
        description: `Current average: ${currentData.metrics.avgSteps?.toLocaleString() || '0'} steps/day`,
        timestamp: 'Live data'
      });
    }
    
    if (lowerQuery.includes('heart') || lowerQuery.includes('bpm')) {
      results.push({
        id: 'metric-heart',
        title: 'Heart Rate Monitoring',
        description: `Average heart rate: ${currentData.metrics.avgHeartRate || 0} BPM`,
        timestamp: 'Live data'
      });
    }
    
    if (lowerQuery.includes('sleep')) {
      results.push({
        id: 'metric-sleep',
        title: 'Sleep Quality Report',
        description: `Average sleep: ${currentData.metrics.avgSleep || 0} hours`,
        timestamp: 'Live data'
      });
    }
    
    results = [...results, ...insightResults];
    currentData.searchResults = results;
    return results;
  },

  async getForecastData() {
    await delay(600);
    return mockForecastData;
  },

  async getRiskData() {
    await delay(500);
    return mockRiskData;
  },

  async getSimulationInsights(sleepIncrease, extraSteps, hydrationIncrease) {
    await delay(300);
    
    const insights = [];
    
    if (sleepIncrease > 0.5) {
      insights.push(`Increasing sleep by ${sleepIncrease}h could reduce fatigue risk by ${Math.round(sleepIncrease * 15)}% and improve recovery.`);
    }
    
    if (extraSteps > 1000) {
      insights.push(`Adding ${extraSteps.toLocaleString()} steps daily may boost cardiovascular health and reduce stress by ${Math.round(extraSteps / 1000 * 3)}%.`);
    }
    
    if (hydrationIncrease > 0.3) {
      insights.push(`Increasing hydration by ${hydrationIncrease}L could improve energy levels and reduce dehydration risk by ${Math.round(hydrationIncrease * 25)}%.`);
    }
    
    if (insights.length === 0) {
      insights.push('Adjust the sliders above to see how lifestyle changes could impact your health metrics.');
    }
    
    return insights;
  },

  async simulateForecast(sleepIncrease, extraSteps, hydrationIncrease) {
    await delay(400);
    
    const stepMultiplier = 1 + (extraSteps / 10000);
    const sleepImpact = sleepIncrease * 0.5;
    const hydrationImpact = hydrationIncrease * 0.3;
    
    const adjusted = {
      steps: mockForecastData.steps.map(item => ({
        ...item,
        predicted: Math.round(item.predicted * stepMultiplier + extraSteps * 0.15)
      })),
      heartRate: mockForecastData.heartRate.map(item => ({
        ...item,
        predicted: Math.max(55, Math.round(item.predicted - sleepImpact - hydrationImpact))
      })),
      sleep: mockForecastData.sleep.map(item => ({
        ...item,
        predicted: Math.min(9.5, Math.max(5, item.predicted + sleepIncrease * 0.8))
      }))
    };
    
    const newRisks = mockRiskData.map(risk => {
      let newPercentage = risk.percentage;
      
      if (risk.type === 'fatigue') {
        newPercentage = Math.max(5, risk.percentage - sleepIncrease * 15 - hydrationIncrease * 8);
      } else if (risk.type === 'hydration') {
        newPercentage = Math.max(5, risk.percentage - hydrationIncrease * 25);
      } else if (risk.type === 'sleep') {
        newPercentage = Math.max(10, risk.percentage - sleepIncrease * 20);
      } else if (risk.type === 'stress') {
        newPercentage = Math.max(8, risk.percentage - sleepIncrease * 10 - (extraSteps / 1000) * 3);
      }
      
      const level = newPercentage <= 25 ? 'low' : newPercentage <= 50 ? 'medium' : 'high';
      
      return {
        ...risk,
        percentage: Math.round(newPercentage),
        level
      };
    });
    
    return { ...adjusted, risks: newRisks };
  },

  async chatWithAI(prompt) {
    console.log('API chatWithAI called with prompt:', prompt);
    await delay(300);
    
    const healthContext = {
      avgSteps: currentData.metrics?.avgSteps || 8420,
      avgHeartRate: currentData.metrics?.avgHeartRate || 72,
      avgSleep: currentData.metrics?.avgSleep || 7.2,
      totalUsers: currentData.metrics?.totalPatients || 1
    };
    
    console.log('Health context for AI:', healthContext);
    
    try {
      const aiResponse = await geminiService.chatWithAI(prompt, healthContext);
      console.log('Gemini AI response:', aiResponse);
      return aiResponse;
    } catch (error) {
      console.error('Gemini AI chat error:', error);
      
      // Enhanced fallback responses
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('fever')) {
        return 'For fever, rest and stay hydrated. Monitor your temperature and consult a healthcare provider if it persists above 101°F (38.3°C) or if you experience severe symptoms. Take acetaminophen or ibuprofen as directed for comfort.';
      }
      
      if (lowerPrompt.includes('sleep')) {
        return `Based on your ${healthContext.avgSleep} hours of sleep, maintain a consistent sleep schedule. Aim for 7-9 hours nightly with a cool, dark room and avoid screens before bed.`;
      }
      
      if (lowerPrompt.includes('stress')) {
        return 'Try deep breathing exercises, regular physical activity, and mindfulness practices. Even 5-10 minutes of meditation daily can significantly reduce stress levels.';
      }
      
      if (lowerPrompt.includes('habit')) {
        return `Focus on: 1) Consistent sleep schedule, 2) Increase daily steps from ${healthContext.avgSteps} to 10,000+, 3) Stay hydrated, 4) Regular meals. Small changes make big differences!`;
      }
      
      return 'I\'m here to help with your health questions! I can provide advice on sleep, exercise, nutrition, stress management, and general wellness. What specific area would you like guidance on?';
    }
  },

  async getWeeklyData() {
    await delay(500);
    return mockWeeklyData;
  },

  async getHabitSuggestions() {
    await delay(600);
    return mockHabits;
  },

  async getSleepQualityData() {
    await delay(550);
    return mockSleepQuality;
  },

  async getWaterData() {
    await delay(400);
    return currentData.waterData || [];
  },

  async getHeartRateData() {
    await delay(400);
    return currentData.heartRateData || [];
  },

  async getStressLevel() {
    await delay(400);
    return Math.floor(Math.random() * 40) + 20;
  },

  async generateWeeklyPDF(data) {
    await delay(2000);
    const pdfContent = `Weekly Health Report\n\nSteps: ${data.avgSteps}\nHeart Rate: ${data.avgHeartRate}\nSleep: ${data.avgSleep}h\nHydration: ${data.avgHydration}L`;
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weekly-health-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true, message: 'PDF downloaded successfully' };
  }
};