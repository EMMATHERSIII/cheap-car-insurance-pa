import { ENV } from "./_core/env";

export interface TelegramMessage {
  title: string;
  content: string;
  type?: "lead" | "contact" | "info";
}

/**
 * Send a message to Telegram
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables
 */
export async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
  try {
    const botToken = ENV.telegramBotToken;
    const chatId = ENV.telegramChatId;

    if (!botToken || !chatId) {
      console.warn("Telegram credentials not configured. Skipping notification.");
      return false;
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // Format the message
    let formattedMessage = `<b>${message.title}</b>\n\n${message.content}`;
    
    if (message.type) {
      formattedMessage = `<b>[${message.type.toUpperCase()}]</b> ${formattedMessage}`;
    }

    // Add timestamp
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formattedMessage += `\n\n<i>📅 ${timestamp}</i>`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Telegram API error:", error);
      return false;
    }

    console.log("✅ Telegram notification sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
}

/**
 * Send a lead notification to Telegram
 */
export async function notifyLeadTelegram(leadData: {
  age?: number;
  state?: string;
  zipCode?: string;
  vehicleType?: string;
  vehicleYear?: string;
  accidents?: boolean;
  insuranceCompany?: string;
  email?: string;
  phone?: string;
}): Promise<boolean> {
  const content = `
📋 <b>New Lead Received!</b>

👤 <b>Personal Info:</b>
• Age: ${leadData.age || "N/A"}
• Email: ${leadData.email || "N/A"}
• Phone: ${leadData.phone || "N/A"}

🚗 <b>Vehicle Info:</b>
• Type: ${leadData.vehicleType || "N/A"}
• Year: ${leadData.vehicleYear || "N/A"}
• State: ${leadData.state || "N/A"}
• ZIP: ${leadData.zipCode || "N/A"}

📊 <b>Insurance Info:</b>
• Current Company: ${leadData.insuranceCompany || "N/A"}
• Recent Accidents: ${leadData.accidents ? "Yes" : "No"}
  `.trim();

  return sendTelegramMessage({
    title: "🎉 New Lead Submission",
    content,
    type: "lead",
  });
}

/**
 * Send a contact form notification to Telegram
 */
export async function notifyContactTelegram(contactData: {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}): Promise<boolean> {
  const content = `
📧 <b>New Contact Form Submission</b>

👤 <b>Contact Info:</b>
• Name: ${contactData.name || "N/A"}
• Email: ${contactData.email || "N/A"}
• Phone: ${contactData.phone || "N/A"}

💬 <b>Message:</b>
${contactData.message || "N/A"}
  `.trim();

  return sendTelegramMessage({
    title: "📬 New Contact Form",
    content,
    type: "contact",
  });
}
