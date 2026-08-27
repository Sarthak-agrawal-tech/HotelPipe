import { Request, Response } from 'express';
import { AiService } from '../services/aiService';
import { WhatsappService } from '../services/whatsappService';
import { LeadService } from '../services/leadService';

export const WhatsappController = {
  async webhook(req: Request, res: Response) {
    try {
      const body = req.body;
      
      if (body.entry && body.entry[0].changes) {
        const changes = body.entry[0].changes[0].value;
        if (changes.messages && changes.messages.length > 0) {
          const message = changes.messages[0];
          const phone = message.from;
          
          // Handle standard text OR a button click
          let userText = "";
          if (message.type === 'text') {
            userText = message.text?.body;
          } else if (message.type === 'interactive') {
            userText = message.interactive?.button_reply?.title;
          }

          if (userText) {
            // 1. Ingest Message & Create/Update Lead
            const lead = await LeadService.handleIncomingMessage(phone, userText);
            
            // 2. Fetch required context
            const chatHistory = await LeadService.getChatHistory(lead.id);
            const availableHotels = await LeadService.getAllHotels();
            
            // 3. Process via Gemini
            const aiResponse = await AiService.processAggregatorLead(userText, chatHistory, availableHotels);
            
            // 4. Update Database with new preferences
            await LeadService.updateLeadPreferences(lead.id, aiResponse.extractedPrefs, aiResponse.replyToUser);

            // 5. Send Response via WhatsApp
            if (aiResponse.replyToUser) {
              await WhatsappService.sendMessage(phone, aiResponse.replyToUser, aiResponse.interactiveButtons);
            }
          }
        }
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.sendStatus(500);
    }
  }
};