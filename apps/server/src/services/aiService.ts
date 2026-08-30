import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const AiService = {
  async processHotelLead(userMessage: string, chatHistory: any[], hotelDetails: any) {
    // Format the last few messages to give Gemini conversational context
    const historyString = chatHistory
      .map((m) => `${m.sender === 'USER' ? 'Guest' : 'You'}: ${m.text}`)
      .join('\n');
    
    const prompt = `
      You are the official AI receptionist for ${hotelDetails.name || 'our hotel'}. 
      Your goal is to politely answer guest questions, provide information based strictly on the hotel details provided below, and collect necessary booking information.

      HOTEL DETAILS KNOWLEDGE BASE:
      ${JSON.stringify(hotelDetails, null, 2)}
      
      RECENT CHAT HISTORY:
      ${historyString}

      NEW GUEST MESSAGE: 
      "${userMessage}"
      
      RULES:
      1. ONLY answer questions using the provided Hotel Details. If a guest asks something not covered in the details, politely say you don't have that information and offer to connect them with a manager.
      2. If the guest explicitly asks to speak to a human, manager, or staff, set "wantsHuman" to true.
      3. Try to naturally extract their name, the type of inquiry (e.g., room, wedding, conference), event date, and guest count from the conversation.
      4. Keep your replies warm, professional, and concise. Use the language the guest is speaking (English or Hindi).

      Return EXACTLY this JSON structure and nothing else. DO NOT use markdown code blocks (\`\`\`json).
      {
        "replyToUser": "Your conversational response to the guest",
        "extractedPrefs": {
          "name": "extracted guest name or null",
          "inquiryType": "extracted inquiry type (e.g., 'wedding', 'room booking') or null",
          "guestCount": "number (extract digits) or null",
          "eventDate": "extracted date in YYYY-MM-DD format or null",
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
      // Strip out any accidental markdown formatting the AI might include
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Failsafe response if the AI API goes down
      return {
        replyToUser: "I am having a little trouble connecting right now. Let me grab a human agent for you.",
        extractedPrefs: { wantsHuman: true }
      };
    }
  }
};