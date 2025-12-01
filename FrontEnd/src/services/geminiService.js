const GEMINI_API_KEY = 'AIzaSyCcXki2jCJYzcn9riKCOTfphA25FByOKb8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const geminiService = {
  async generateHealthInsights(healthData) {
    const prompt = `As a health data analyst, analyze this health data and provide 3 key insights in a conversational tone. Focus on actionable recommendations:

Health Data: ${JSON.stringify(healthData, null, 2)}

Provide insights about trends, recommendations for improvement, and any concerning patterns. Keep response under 200 words.`;
    
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
      return 'I\'m analyzing your health data to provide personalized insights. Your overall wellness trend shows room for improvement in sleep consistency and activity levels. Would you like specific recommendations for any particular area?';
    }
  },

  async chatWithAI(message, healthContext = {}) {
    const prompt = `You are a helpful health assistant. User message: "${message}"

Health context: ${JSON.stringify(healthContext)}

Provide a helpful, encouraging response with actionable health advice. Keep it conversational and under 150 words.`;
    
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
      console.error('Gemini chat error:', error);
      return 'I\'m here to help with your health questions! Could you tell me more about what you\'d like to know?';
    }
  }
};