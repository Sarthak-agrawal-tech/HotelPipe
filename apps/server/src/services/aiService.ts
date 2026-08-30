import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const AiService = {
  async processAggregatorLead(userMessage: string, chatHistory: any[], availableHotels: any[]) {
    // Format history for Gemini
    const historyString = chatHistory.map(m => `${m.sender}: ${m.message_text}`).join('\n');
    
    const prompt = `
      You are an AI hotel concierge. Your job is to help users find the perfect hotel, collect their requirements, and match them with our inventory.
      
      Available Hotels in Inventory:
      ${JSON.stringify(availableHotels, null, 2)}
      
      Recent Chat History:
      ${historyString}
      USER: ${userMessage}
      
      Rules:
      1. If they ask for hotels, filter the inventory based on their needs (location, capacity, rooms, rating) and suggest matches.
      2. If they select a hotel, ask if they'd like to talk to the hotel's personnel.
      3. If they say yes to talking to personnel, give them the hotel's phone number and set "wantsHuman" to true.
      
      Return EXACTLY this JSON structure and nothing else. DO NOT use markdown code blocks (\`\`\`json).
      {
        "replyToUser": "Your conversational response",
        "interactiveButtons": [{"id": "btn1", "title": "Button Text"}] (Optional array of max 3 buttons, or null),
        "extractedPrefs": {
          "name": "string or null",
          "location": "string or null",
          "guestCount": "number or null",
          "roomCount": "number or null",
          "purpose": "string or null (e.g., 'wedding', 'corporate')",
          "selectedHotelId": "UUID of the matched hotel or null",
          "wantsHuman": true/false
        }
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const rawText = response.text || '{}';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        replyToUser: "I'm having a little trouble connecting right now. Let me grab a human agent for you.",
        interactiveButtons: null,
        extractedPrefs: { wantsHuman: true }
      };
    }
  }
};