import { env } from '../config/env';

export const WhatsappService = {
  async sendMessage(toPhone: string, text: string, buttons?: { id: string, title: string }[]) {
    let payload: any = {
      to: toPhone,
      recipient_type: "individual",
    };

    if (buttons && buttons.length > 0) {
      payload.type = "interactive";
      payload.interactive = {
        type: "button",
        body: { text: text },
        action: {
          buttons: buttons.map(btn => ({
            type: "reply",
            reply: { id: btn.id, title: btn.title.substring(0, 20) } // Meta limits title to 20 chars
          }))
        }
      };
    } else {
      payload.type = "text";
      payload.text = { body: text };
    }

    try {
      await fetch(`https://apis.aisensy.com/project-apis/v1/project/${env.AISENSY_PROJECT_ID}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-AiSensy-Project-API-Pwd': env.AISENSY_API_KEY
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Failed to send WhatsApp message via AiSensy:", error);
    }
  }
};