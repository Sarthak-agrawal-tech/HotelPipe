import { supabase } from '../config/supabaseClient';

export const LeadService = {
  async handleIncomingMessage(phone: string, text: string) {
    let { data: lead } = await supabase.from('leads').select('*').eq('phone', phone).single();

    if (!lead) {
      const { data } = await supabase.from('leads').insert({ phone }).select().single();
      lead = data;
    } else {
      await supabase.from('leads').update({
        last_interaction: new Date().toISOString(),
        followup_level: 0
      }).eq('id', lead.id);
    }
    
    // Log User Message
    await supabase.from('messages').insert({ lead_id: lead.id, sender: 'USER', message_text: text });
    return lead;
  },

  async updateLeadPreferences(leadId: string, prefs: any, aiReply: string) {
    await supabase.from('leads').update({
      name: prefs.name || undefined,
      location_preference: prefs.location || undefined,
      guest_count: prefs.guestCount || undefined,
      room_count: prefs.roomCount || undefined,
      purpose: prefs.purpose || undefined,
      selected_hotel_id: prefs.selectedHotelId || undefined,
      wants_human: prefs.wantsHuman || false,
      status: prefs.wantsHuman ? 'FOLLOW-UP DUE' : 'WAITING'
    }).eq('id', leadId);

    // Log AI Message
    await supabase.from('messages').insert({ lead_id: leadId, sender: 'AI', message_text: aiReply });
  },

  async getChatHistory(leadId: string) {
    const { data } = await supabase.from('messages')
      .select('sender, message_text')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(6);
    return (data || []).reverse();
  },

  async getAllHotels() {
    const { data } = await supabase.from('hotels').select('*');
    return data || [];
  },

  async getLeadsForFollowup() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase.from('leads').select('*, selected_hotel_id(*)')
      .eq('status', 'WAITING')
      .lte('last_interaction', oneDayAgo)
      .lt('followup_level', 3)
      .not('selected_hotel_id', 'is', null);
    return data || [];
  },
  
  async incrementFollowup(leadId: string) {
    const { data: lead } = await supabase.from('leads').select('followup_level').eq('id', leadId).single();
    if (lead) {
      await supabase.from('leads').update({ followup_level: lead.followup_level + 1 }).eq('id', leadId);
    }
  }
};