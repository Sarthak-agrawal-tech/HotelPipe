import { Request, Response } from 'express';
import { AiService } from '../services/aiService';
import { WhatsappService } from '../services/whatsappService';
import { LeadService } from '../services/leadService';
import { prisma } from '../config/prismaClient';


export const WhatsappController = {
  async webhook(req: Request, res: Response) {
    try {
      const body = req.body;
      
      // Standard Meta WhatsApp Cloud API payload structure
      if (body.entry && body.entry[0].changes) {
        const changes = body.entry[0].changes[0].value;
        
        if (changes.messages && changes.messages.length > 0) {
          const message = changes.messages[0];
          const userPhone = message.from;
          
          // Identify which hotel is receiving this message via the business phone number
          const businessNumber = changes.metadata?.display_phone_number;

          let userText = "";
          if (message.type === 'text') {
            userText = message.text?.body;
          } else if (message.type === 'interactive') {
            userText = message.interactive?.button_reply?.title;
          }

          if (userText && businessNumber) {
            // 1. Find the specific hotel in your database
            // Note: Ensure your Hotel schema has a 'whatsappNumber' field
            const hotel = await prisma.hotel.findFirst({
              where: { whatsappNumber: businessNumber } 
            });

            if (!hotel) {
              console.error("Webhook received for unknown business number:", businessNumber);
              return res.sendStatus(200);
            }

            // 2. Ingest Message & Create/Update Lead
            const lead = await LeadService.handleIncomingMessage(userPhone, userText, hotel.id);
            const chatHistory = await LeadService.getChatHistory(lead.id);
            
            // 3. INSTANT ACKNOWLEDGMENT (Function 5 compliance)
            // If this is the very first message in the chat history, send the instant welcome
            if (chatHistory.length === 1) {
              const instantMsg = `Namaste! Welcome to ${hotel.name}. We have received your inquiry and will assist you shortly.`;
              // We do NOT await this. We let it fire immediately in the background.
              WhatsappService.sendMessage(userPhone, instantMsg);
            }
            
            // 4. Process via Gemini AI
            const aiResponse = await AiService.processHotelLead(userText, chatHistory, hotel);
            
            // 5. Update Database with AI's extracted data
            await LeadService.updateLeadPreferences(lead.id, aiResponse.extractedPrefs, aiResponse.replyToUser);

            // 6. Send AI's Conversational Response
            if (aiResponse.replyToUser) {
              await WhatsappService.sendMessage(userPhone, aiResponse.replyToUser);
            }
          }
        }
      }
      
      // Always return 200 OK immediately so WhatsApp doesn't retry and duplicate the webhook
      res.sendStatus(200);
      
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.sendStatus(500);
    }
  },

  // WhatsApp requires a verification endpoint when you first set up the webhook
  verifyWebhook(req: Request, res: Response) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }
};