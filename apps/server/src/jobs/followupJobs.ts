import cron from 'node-cron';
import { LeadStatus } from '../../generated/prisma/enums';
import { WhatsappService } from '../services/whatsappService';
import {prisma} from '../config/prismaClient';


export const startFollowupJob = () => {
  // Runs exactly at 8:00 AM every morning (Server Time)
  cron.schedule('0 8 * * *', async () => {
    console.log("⏳ Running daily 8:00 AM follow-up job...");
    
    try {
      // 1. Fetch leads that are still active (WAITING or INTERESTED)
      const leads = await prisma.lead.findMany({
        where: {
          status: {
            in: [LeadStatus.WAITING, LeadStatus.INTERESTED]
          }
        },
        include: {
          hotel: true,
          followups: true // We use this to count how many follow-ups have already been sent
        }
      });

      for (const lead of leads) {
        // Calculate full days passed since their last interaction (updatedAt)
        const daysSince = Math.floor((Date.now() - lead.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
        const followUpCount = lead.followups.length;
        
        let message = "";

        // Safely fallback to generic names if data is missing
        const hotelName = lead.hotel?.name || "our hotel";
        const purpose = lead.inquiryType || "your event";
        const guestName = lead.name !== 'Unknown' ? lead.name : 'Sir/Ma\'am';

        // 2. Determine which follow-up to send
        // Sequence stops automatically if followUpCount is 3 or more
        if (daysSince >= 7 && followUpCount === 2) {
          message = `Namaste ${guestName}, this is a final check regarding your inquiry at ${hotelName}. Are you still looking for a venue for ${purpose}? Let us know if we can help!`;
        } else if (daysSince >= 3 && followUpCount === 1) {
          message = `Hi ${guestName}! Dates at ${hotelName} are filling up quickly. Are you still interested in finalizing your booking for ${purpose}?`;
        } else if (daysSince >= 1 && followUpCount === 0) {
          message = `Hello ${guestName}, I hope you are having a great day. You inquired about ${hotelName} for ${purpose}. Do you have any questions I can answer for you?`;
        }

        // 3. Send the message and record the follow-up in the database
        if (message) {
          // Sending interactive buttons makes it easy for the guest to reply, 
          // which updates the 'updatedAt' timestamp and pauses the sequence!
          await WhatsappService.sendMessage(lead.phone, message, [
            { id: "followup_yes", title: "Yes, I'm interested" },
            { id: "followup_no", title: "No, thank you" }
          ]);

          const currentDayNumber = followUpCount === 0 ? 1 : followUpCount === 1 ? 3 : 7;
          // Record this follow-up so we don't send it again tomorrow
          await prisma.followUp.create({
            data: {
              leadId: lead.id,
              hotelId: lead.hotelId,
              dayNumber: currentDayNumber,
              scheduledAt: new Date(), // Logs that it was scheduled for today
              sentAt: new Date(),      // Logs the exact time it was sent
              message: message
            }
          });
          
          console.log(`✅ Sent Day ${followUpCount === 0 ? 1 : followUpCount === 1 ? 3 : 7} follow-up to ${lead.phone}`);
        }
      }
    } catch (error) {
      console.error("❌ Cron Job Execution Error:", error);
    }
  });
};