import { notifyOwner } from "./_core/notification";
import { ENV } from "./_core/env";

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: Date;
}

/**
 * Send email notification when someone submits the contact form
 * Uses the built-in notification system to alert the owner
 */
export async function sendContactFormNotification(data: ContactEmailData): Promise<boolean> {
  const recipient = ENV.contactEmailRecipient || "Owner";
  
  const title = `New Contact Form Submission from ${data.name}`;
  
  const content = `
You have received a new contact form submission:

**Name:** ${data.name}
**Email:** ${data.email}
**Phone:** ${data.phone || "Not provided"}
**Submitted:** ${data.submittedAt.toLocaleString()}

**Message:**
${data.message}

---
Reply directly to: ${data.email}
  `.trim();

  try {
    const success = await notifyOwner({ title, content });
    return success;
  } catch (error) {
    console.error("Failed to send contact form notification:", error);
    return false;
  }
}
