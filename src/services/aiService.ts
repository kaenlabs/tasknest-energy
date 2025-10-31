import { GoogleGenerativeAI } from '@google/generative-ai';
import i18n from '../locales/i18n';

// Initialize Gemini AI
// Get your free API key from: https://makersuite.google.com/app/apikey
// Add to .env file: EXPO_PUBLIC_GEMINI_API_KEY=your_key
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface TaskSuggestion {
  category: 'work' | 'personal' | 'health' | 'shopping' | 'other';
  priority: 'low' | 'medium' | 'high';
  energy: 'low' | 'high';
  bestTime: 'morning' | 'afternoon' | 'evening';
  estimatedDuration?: string;
  tips?: string;
}

/**
 * Analyze task title and get AI-powered suggestions
 * Uses Google Gemini AI to provide intelligent categorization
 */
export const getTaskSuggestions = async (taskTitle: string): Promise<TaskSuggestion | null> => {
  try {
    // Skip if API key not configured
    if (!API_KEY || !genAI) {
      console.log('Gemini API key not configured');
      return null;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const currentLanguage = i18n.locale;
    const isTurkish = currentLanguage === 'tr';

    const prompt = isTurkish ? `
Bu görevi analiz et ve JSON formatında öneriler sun:
Görev: "${taskTitle}"

Yanıt bu yapıda geçerli JSON olmalı:
{
  "category": "work" | "personal" | "health" | "shopping" | "other",
  "priority": "low" | "medium" | "high",
  "energy": "low" | "high",
  "bestTime": "morning" | "afternoon" | "evening",
  "estimatedDuration": "15 dk" | "30 dk" | "1 saat" | "2+ saat",
  "tips": "Bu görevi tamamlamak için faydalı bir ipucu (Türkçe)"
}

Kurallar:
- work: İş, toplantılar, e-postalar, projeler
- personal: Hobiler, öğrenme, aile zamanı
- health: Egzersiz, meditasyon, doktor ziyaretleri
- shopping: Market, işler, alışveriş
- other: Diğer görevler

- priority: high (acil), medium (önemli), low (bekleyebilir)
- energy: high (odaklanma/fiziksel), low (rutin/basit)
- bestTime: Görev doğasına göre (toplantı=morning, alışveriş=evening, vb.)

SADECE JSON nesnesini döndür, markdown veya açıklama yok.
` : `
Analyze this task and provide suggestions in JSON format:
Task: "${taskTitle}"

Response must be valid JSON with this exact structure:
{
  "category": "work" | "personal" | "health" | "shopping" | "other",
  "priority": "low" | "medium" | "high",
  "energy": "low" | "high",
  "bestTime": "morning" | "afternoon" | "evening",
  "estimatedDuration": "15 mins" | "30 mins" | "1 hour" | "2+ hours",
  "tips": "A helpful tip for completing this task"
}

Guidelines:
- work: Job, meetings, emails, projects
- personal: Hobbies, learning, family time
- health: Exercise, meditation, doctor visits
- shopping: Groceries, errands, purchases
- other: Miscellaneous tasks

- priority: high (urgent), medium (important), low (can wait)
- energy: high (focus/physical), low (routine/simple)
- bestTime: Based on task nature (meetings=morning, shopping=evening, etc.)

Return ONLY the JSON object, no markdown, no explanation.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const suggestion: TaskSuggestion = JSON.parse(jsonMatch[0]);
      return suggestion;
    }

    return null;
  } catch (error) {
    console.error('AI suggestion error:', error);
    return null;
  }
};

/**
 * Get a smart task suggestion based on time of day and user patterns
 */
export const getSmartTaskRecommendation = async (): Promise<string | null> => {
  try {
    if (!API_KEY || !genAI) {
      return null;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const hour = new Date().getHours();
    
    let timeContext = 'morning';
    if (hour >= 12 && hour < 17) timeContext = 'afternoon';
    if (hour >= 17) timeContext = 'evening';

    const prompt = `
Suggest ONE simple, helpful task for someone in the ${timeContext}.
Keep it short (max 5 words), actionable, and energy-appropriate.

Examples:
Morning: "Review today's priorities", "Do morning stretch"
Afternoon: "Take a short walk", "Drink water"
Evening: "Plan tomorrow's tasks", "Tidy workspace"

Return ONLY the task suggestion, nothing else.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/['"]/g, '');
  } catch (error) {
    console.error('Smart recommendation error:', error);
    return null;
  }
};
