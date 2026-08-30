import cron from 'node-cron';
import { LeadService } from '../services/leadService';
import { WhatsappService } from '../services/whatsappService';

export const startFollowupJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const leads = await LeadService.getLeadsForFollowup();

      for (const lead of leads) {
        const leadDate = new Date(lead.last_interaction).getTime();
        const daysSince = Math.floor((Date.now() - leadDate) / (1000 * 60 * 60 * 24));
        
        let message = "";
        
        // Custom message injection using the specific hotel name and purpose 
        const hotelName = lead.selected_hotel_id?.name || "the hotel";
        const purpose = lead.purpose || "your event";

        if (daysSince >= 7 && lead.followup_level === 2) {
          message = `Hello! I'm doing a final check regarding your inquiry for ${hotelName}. Are you still looking for a venue for ${purpose}?`;
        } else if (daysSince >= 3 && lead.followup_level === 1) {
          message = `Hi again! Rooms at ${hotelName} are filling up quickly. Are you still interested in finalizing your booking for ${purpose}?`;
        } else if (daysSince >= 1 && lead.followup_level === 0) {
          message = `Hello sir, I hope you are having a nice day. You inquired about ${hotelName} for ${purpose}. Are you still interested in this?`;
        }

        if (message) {
          // Sending interactive buttons so the AI seamlessly picks up the conversation when they tap "Yes"
          await WhatsappService.sendMessage(lead.phone, message, [
            { id: "followup_yes", title: "Yes" },
            { id: "followup_no", title: "No" }
          ]);
          await LeadService.incrementFollowup(lead.id);
        }
      }
    } catch (error) {
      console.error("Cron Job Execution Error:", error);
    }
  });
};