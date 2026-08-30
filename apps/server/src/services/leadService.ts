import {LeadStatus, LeadSource } from '../../generated/prisma/enums';
import { prisma } from "../config/prismaClient";


export const LeadService = {
  // 1. Handle incoming message (Find existing lead or create a new one)
  async handleIncomingMessage(phone: string, text: string, hotelId: string) {
    // Look for an active lead for this specific hotel
    let lead = await prisma.lead.findFirst({
      where: { phone, hotelId },
      orderBy: { createdAt: 'desc' }
    });

    if (!lead) {
      // Create a brand new WhatsApp lead
      lead = await prisma.lead.create({
        data: {
          phone,
          hotelId,
          name: 'Unknown', // The AI will update this later once it asks their name
          source: LeadSource.WHATSAPP,
          status: LeadStatus.NEW,
        }
      });
    } else {
      // "Touch" the lead so the updatedAt timestamp is refreshed (acts as last_interaction)
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: { updatedAt: new Date() }
      });
    }
    
    // Save the user's message to the chat history
    await prisma.message.create({
      data: {
        leadId: lead.id,
        sender: 'USER',
        text: text
      }
    });

    return lead;
  },

  // 2. Update Lead with AI Extracted Data
  async updateLeadPreferences(leadId: string, prefs: any, aiReply: string) {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        name: prefs.name || undefined,
        inquiryType: prefs.inquiryType || undefined,
        guestCount: prefs.guestCount ? parseInt(prefs.guestCount, 10) : undefined,
        eventDate: prefs.eventDate ? new Date(prefs.eventDate) : undefined,
        // If the AI flagged they want a human, set to FOLLOWUP_DUE, else WAITING
        status: prefs.wantsHuman ? LeadStatus.FOLLOWUP_DUE : LeadStatus.WAITING
      }
    });

    // Save the AI's response to the chat history
    if (aiReply) {
      await prisma.message.create({
        data: {
          leadId: leadId,
          sender: 'AI',
          text: aiReply
        }
      });
    }
  },

  // 3. Fetch recent chat history for the AI prompt
  async getChatHistory(leadId: string) {
    const messages = await prisma.message.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
      take: 6 // Only grab the last 6 messages so we don't overload Gemini's context window
    });
    
    return messages.reverse(); // Return in chronological order
  },

  // 4. Fetch the specific hotel's knowledge base
  async getHotelDetails(hotelId: string) {
    return await prisma.hotel.findUnique({
      where: { id: hotelId }
    });
  }
};