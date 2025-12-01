const GEMINI_API_KEY = 'AIzaSyCcXki2jCJYzcn9riKCOTfphA25FByOKb8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const geminiService = {
  async generateHealthInsights(healthData) {
    const prompt = `As a professional health data analyst, analyze this health data and provide 3 key insights in a conversational, encouraging tone. Focus on actionable recommendations:

Health Metrics:
- Total Users: ${healthData.totalPatients}
- Average Steps: ${healthData.avgSteps}/day
- Average Heart Rate: ${healthData.avgHeartRate} bpm
- Average Sleep: ${healthData.avgSleep} hours
- Critical Cases: ${healthData.criticalCases}

Provide specific, actionable insights about trends, recommendations for improvement, and any concerning patterns. Keep response under 200 words and be encouraging.`;
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const result = await response.json();
      return result.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback analysis based on data
      const { avgSteps, avgHeartRate, avgSleep, criticalCases } = healthData;
      
      let insights = [];
      
      if (avgSteps < 6000) {
        insights.push(`Your ${avgSteps} daily steps are below recommended levels. Try adding short walks throughout the day.`);
      } else if (avgSteps > 10000) {
        insights.push(`Excellent! Your ${avgSteps} daily steps exceed recommendations. Keep up this fantastic activity level.`);
      } else {
        insights.push(`Good progress with ${avgSteps} steps/day. Consider gradually increasing to 10,000+ for optimal health.`);
      }
      
      if (avgHeartRate > 80) {
        insights.push(`Your resting heart rate of ${avgHeartRate} bpm is elevated. Regular cardio can help improve this.`);
      } else {
        insights.push(`Your resting heart rate of ${avgHeartRate} bpm is in a healthy range.`);
      }
      
      if (avgSleep < 7) {
        insights.push(`At ${avgSleep} hours, you need more sleep. Aim for 7-9 hours with a consistent bedtime routine.`);
      } else {
        insights.push(`Great! Your ${avgSleep} hours of sleep supports optimal health and recovery.`);
      }
      
      return insights.join(' ');
    }
  },

  async chatWithAI(message, healthContext = {}) {
    console.log('Gemini chatWithAI called with:', { message, healthContext });
    
    const prompt = `You are a helpful, encouraging health assistant with medical knowledge.

User message: "${message}"

User's health context:
- Average Steps: ${healthContext.avgSteps || 0}/day
- Average Heart Rate: ${healthContext.avgHeartRate || 0} bpm  
- Average Sleep: ${healthContext.avgSleep || 0} hours
- Total Users in dataset: ${healthContext.totalUsers || 0}

Provide a helpful, encouraging response with specific actionable health advice. If they mention symptoms like fever, provide appropriate medical guidance. Keep it conversational and under 150 words. Be supportive and motivating.`;
    
    console.log('Sending prompt to Gemini:', prompt);
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      console.log('Gemini API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Gemini API result:', result);
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini chat error details:', error);
      
      // Fallback responses based on message content
      const lowerMessage = message.toLowerCase();
      const { avgSteps = 0, avgHeartRate = 0, avgSleep = 0 } = healthContext;
      
      if (lowerMessage.includes('sleep')) {
        return `Based on your ${avgSleep} hours of sleep, I recommend maintaining a consistent sleep schedule. Aim for 7-9 hours nightly with a relaxing bedtime routine.`;
      }
      
      if (lowerMessage.includes('steps') || lowerMessage.includes('exercise')) {
        return `Your current ${avgSteps} steps/day is a great start! Try to gradually increase toward 8,000-10,000 daily steps for optimal cardiovascular health.`;
      }
      
      if (lowerMessage.includes('heart')) {
        return `Your heart rate of ${avgHeartRate} bpm shows your cardiovascular status. Regular exercise and stress management can help maintain optimal heart health.`;
      }
      
      return `I'm here to help with your health journey! Based on your data, focus on consistent sleep, staying active, and monitoring your wellness metrics. What specific area would you like to improve?`;
    }
  }
};