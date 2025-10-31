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
  scheduledDate?: string; // "today" | "tomorrow" | "weekend" | "next_week"
  scheduledTime?: string; // "09:00" | "14:00" | "18:00"
  scheduleReason?: string; // Explanation for the suggested time
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
Bugünün tarihi: ${new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Şu anki saat: ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}

Yanıt bu yapıda geçerli JSON olmalı:
{
  "category": "work" | "personal" | "health" | "shopping" | "other",
  "priority": "low" | "medium" | "high",
  "energy": "low" | "high",
  "bestTime": "morning" | "afternoon" | "evening",
  "estimatedDuration": "15 dk" | "30 dk" | "1 saat" | "2+ saat",
  "tips": "Bu görevi tamamlamak için faydalı bir ipucu (Türkçe)",
  "scheduledDate": "today" | "tomorrow" | "weekend" | "next_week",
  "scheduledTime": "HH:MM formatında saat (örn: 09:00, 14:00, 18:00)",
  "scheduleReason": "Bu tarih ve saatin neden uygun olduğunu açıkla (Türkçe, kısa)"
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

ZAMANLAMA ÖNERİLERİ:
- scheduledDate: Görevin doğasına göre en uygun gün
  * "today": Acil görevler, bugün yapılabilecekler
  * "tomorrow": Planlama gerektiren, yarın daha uygun olanlar
  * "weekend": Hafta sonu aktiviteleri (alışveriş, hobiler, temizlik)
  * "next_week": Acil olmayan, gelecek haftaya bırakılabilecek

- scheduledTime: Görev tipine göre ideal saat
  * Spor/Egzersiz: 07:00-09:00 (sabah enerjisi)
  * İş toplantıları: 09:00-11:00 (odaklanma zamanı)
  * Yaratıcı işler: 10:00-12:00 (zirve performans)
  * Alışveriş: 17:00-19:00 (iş sonrası)
  * Rahatlama/Okuma: 20:00-22:00 (akşam sakinliği)
  * Rutin işler: 14:00-16:00 (öğleden sonra)

- scheduleReason: Kısa ve motive edici açıklama
  Örnekler:
  * "Sabah enerjiniz en yüksek seviyede"
  * "Hafta sonu daha çok vaktiniz olacak"
  * "Marketler akşam daha az kalabalık"
  * "Yaratıcılığınız öğleden önce zirve yapıyor"

SADECE JSON nesnesini döndür, markdown veya açıklama yok.
` : `
Analyze this task and provide suggestions in JSON format:
Task: "${taskTitle}"
Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Current time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}

Response must be valid JSON with this exact structure:
{
  "category": "work" | "personal" | "health" | "shopping" | "other",
  "priority": "low" | "medium" | "high",
  "energy": "low" | "high",
  "bestTime": "morning" | "afternoon" | "evening",
  "estimatedDuration": "15 mins" | "30 mins" | "1 hour" | "2+ hours",
  "tips": "A helpful tip for completing this task",
  "scheduledDate": "today" | "tomorrow" | "weekend" | "next_week",
  "scheduledTime": "Time in HH:MM format (e.g., 09:00, 14:00, 18:00)",
  "scheduleReason": "Brief explanation why this time is suitable"
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

SCHEDULING SUGGESTIONS:
- scheduledDate: Best day based on task nature
  * "today": Urgent tasks, can be done today
  * "tomorrow": Tasks needing planning, better tomorrow
  * "weekend": Weekend activities (shopping, hobbies, cleaning)
  * "next_week": Non-urgent, can be scheduled for next week

- scheduledTime: Ideal time based on task type
  * Exercise/Sports: 07:00-09:00 (morning energy)
  * Work meetings: 09:00-11:00 (focus time)
  * Creative work: 10:00-12:00 (peak performance)
  * Shopping: 17:00-19:00 (after work)
  * Relaxation/Reading: 20:00-22:00 (evening calm)
  * Routine tasks: 14:00-16:00 (afternoon)

- scheduleReason: Brief and motivating explanation
  Examples:
  * "Your energy is highest in the morning"
  * "You'll have more time on the weekend"
  * "Stores are less crowded in the evening"
  * "Your creativity peaks before noon"

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
