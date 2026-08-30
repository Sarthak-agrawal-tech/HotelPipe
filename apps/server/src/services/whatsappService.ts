export const WhatsappService = {
  async sendMessage(toPhone: string, text: string, buttons?: { id: string, title: string }[]) {
    // Meta requires the phone number without the '+' sign
    const cleanPhone = toPhone.replace('+', '');

    const payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
    };

    if (buttons && buttons.length > 0) {
      payload.type = "interactive";
      payload.interactive = {
        type: "button",
        body: { text: text },
        action: {
          buttons: buttons.map(btn => ({
            type: "reply",
            reply: { id: btn.id, title: btn.title.substring(0, 20) } 
          }))
        }
      };
    } else {
      payload.type = "text";
      payload.text = { body: text };
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ Meta API Error [${response.status}]:`, errorData);
      } else {
        console.log(`✅ WhatsApp message sent via Meta to ${toPhone}`);
      }
    } catch (error) {
      console.error("❌ Failed to send WhatsApp message:", error);
    }
  }
};