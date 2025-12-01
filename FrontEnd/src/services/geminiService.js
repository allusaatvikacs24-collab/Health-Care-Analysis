const GEMINI_API_KEY = 'AIzaSyCcXki2jCJYzcn9riKCOTfphA25FByOKb8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const geminiService = {
  async generateHealthInsights(healthData) {
    // Generate insights based on health data without API call for now
    const { totalPatients, avgSteps, avgHeartRate, avgSleep, criticalCases } = healthData;
    
    let insights = [];
    
    // Steps analysis
    if (avgSteps < 6000) {
      insights.push(`Your average of ${avgSteps} steps/day is below the recommended 8,000-10,000. Try adding a 15-minute walk after meals.`);
    } else if (avgSteps > 10000) {
      insights.push(`Excellent! Your ${avgSteps} daily steps exceed recommendations. Keep up this great activity level.`);
    } else {
      insights.push(`Good progress with ${avgSteps} steps/day. Consider increasing to 10,000+ for optimal cardiovascular health.`);
    }
    
    // Heart rate analysis
    if (avgHeartRate > 80) {
      insights.push(`Your resting heart rate of ${avgHeartRate} bpm is slightly elevated. Regular cardio exercise can help lower it.`);
    } else if (avgHeartRate < 60) {
      insights.push(`Your resting heart rate of ${avgHeartRate} bpm indicates excellent cardiovascular fitness.`);
    } else {
      insights.push(`Your resting heart rate of ${avgHeartRate} bpm is in the healthy range (60-80 bpm).`);
    }
    
    // Sleep analysis
    if (avgSleep < 7) {
      insights.push(`At ${avgSleep} hours, you're getting less sleep than recommended (7-9 hours). Try establishing a consistent bedtime routine.`);
    } else if (avgSleep > 9) {
      insights.push(`You're getting ${avgSleep} hours of sleep, which is on the higher end. Ensure it's quality sleep with good sleep hygiene.`);
    } else {
      insights.push(`Great! Your ${avgSleep} hours of sleep falls within the optimal 7-9 hour range for adults.`);
    }
    
    return insights.join(' ');
  },

  async chatWithAI(message, healthContext = {}) {
    const lowerMessage = message.toLowerCase();
    const { avgSteps = 0, avgHeartRate = 0, avgSleep = 0 } = healthContext;
    
    if (lowerMessage.includes('sleep')) {
      return `Based on your data showing ${avgSleep} hours of sleep, I recommend maintaining a consistent sleep schedule. Aim for 7-9 hours nightly. Try avoiding screens 1 hour before bed and keeping your room cool and dark.`;
    }
    
    if (lowerMessage.includes('steps') || lowerMessage.includes('exercise')) {
      return `Your current average of ${avgSteps} steps/day is a good start! To improve cardiovascular health, try to reach 8,000-10,000 steps daily. You can break this into smaller walks throughout the day.`;
    }
    
    if (lowerMessage.includes('heart') || lowerMessage.includes('cardio')) {
      return `Your heart rate of ${avgHeartRate} bpm shows your cardiovascular status. Regular aerobic exercise, stress management, and adequate sleep can help maintain a healthy resting heart rate between 60-80 bpm.`;
    }
    
    if (lowerMessage.includes('stress')) {
      return 'Managing stress is crucial for overall health. Try deep breathing exercises, regular physical activity, adequate sleep, and mindfulness practices. Even 5-10 minutes of meditation daily can make a difference.';
    }
    
    return `I'm here to help with your health journey! Based on your data, focus on maintaining consistent sleep (7-9 hours), staying active (8,000+ steps), and monitoring your heart health. What specific area would you like to improve?`;
  }
};