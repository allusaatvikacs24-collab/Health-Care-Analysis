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
  waterData: [],
  heartRateData: [],
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
    await delay(2000);
    try {
      const text = await file.text();
      const parsedData = parseCSVData(text);
      
      // Update all data with parsed CSV data
      currentData.metrics = parsedData.metrics;
      currentData.trendData = parsedData.trendData;
      currentData.diseaseData = parsedData.healthData;
      currentData.waterData = parsedData.waterData;
      currentData.heartRateData = parsedData.heartRateData;
      
      // Save to localStorage for persistence
      localStorage.setItem('healthData', JSON.stringify(currentData));
      
      const insights = [
        {
          id: Date.now(),
          type: 'success',
          title: 'Health Data Processed',
          description: `Analyzed ${parsedData.metrics.totalPatients} health records with avg ${parsedData.metrics.avgSteps} steps/day`,
          timestamp: 'Just now'
        },
        {
          id: Date.now() + 1,
          type: parsedData.metrics.criticalCases > 0 ? 'warning' : 'success',
          title: 'Health Assessment',
          description: parsedData.metrics.criticalCases > 0 ? 
            `${parsedData.metrics.criticalCases} individuals need health attention` :
            'All individuals show healthy vital signs',
          timestamp: 'Just now'
        }
      ];
      currentData.insights = [...insights, ...currentData.insights.slice(0, 2)];
      
      // Trigger live updates
      window.dispatchEvent(new CustomEvent('dataUpdated', { detail: currentData }));
      
      return { 
        success: true, 
        message: `Health data processed: ${parsedData.metrics.totalPatients} records analyzed`, 
        fileName: file.name,
        data: parsedData
      };
    } catch (error) {
      throw new Error('File processing failed. Please check your CSV format and try again.');
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
    await delay(500);
    try {
      const healthContext = {
        avgSteps: currentData.metrics?.avgSteps || 0,
        avgHeartRate: currentData.metrics?.avgHeartRate || 0,
        avgSleep: currentData.metrics?.avgSleep || 0,
        totalUsers: currentData.metrics?.totalPatients || 0
      };
      
      return await geminiService.chatWithAI(prompt, healthContext);
    } catch (error) {
      console.error('AI chat error:', error);
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('sleep')) return mockChatResponses.sleep;
      if (lowerPrompt.includes('stress')) return mockChatResponses.stress;
      if (lowerPrompt.includes('habit')) return mockChatResponses.habits;
      
      return mockChatResponses.default;
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