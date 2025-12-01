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

interface LeadData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  state: string;
  zipCode: string;
  vehicleType: string;
  vehicleYear: number;
  hasRecentAccidents: string;
  currentInsurer: string;
  coverageType: string;
  ownershipStatus: string;
  createdAt: Date;
}

/**
 * Send email notification to owner when a new lead is submitted
 */
export async function sendLeadNotificationToOwner(lead: LeadData): Promise<boolean> {
  const title = `🎉 New Insurance Lead #${lead.id}`;
  
  const content = `
**New Quote Request Received!**

**Customer Information:**
- Name: ${lead.firstName} ${lead.lastName}
- Email: ${lead.email}
- Phone: ${lead.phone}
- Age: ${lead.age}
- Location: ${lead.zipCode}, ${lead.state}

**Vehicle Information:**
- Type: ${lead.vehicleType}
- Year: ${lead.vehicleYear}
- Ownership: ${lead.ownershipStatus}

**Insurance Details:**
- Current Insurer: ${lead.currentInsurer}
- Coverage Type: ${lead.coverageType}
- Recent Accidents: ${lead.hasRecentAccidents}

**Submitted:** ${lead.createdAt.toLocaleString()}

---
Lead ID: ${lead.id}
  `.trim();

  try {
    const success = await notifyOwner({ title, content });
    return success;
  } catch (error) {
    console.error("Failed to send lead notification to owner:", error);
    return false;
  }
}

/**
 * Send confirmation email to customer after they submit a quote request
 * Note: This uses the notification system to send to owner's email
 * In production, you'd use a proper email service like SendGrid or AWS SES
 */
export async function sendLeadConfirmationEmail(lead: LeadData): Promise<boolean> {
  // For now, we'll just log this since we don't have a direct email service
  // In production, you would integrate with SendGrid, AWS SES, or similar
  console.log(`Would send confirmation email to ${lead.email}`);
  
  // TODO: Integrate with actual email service
  // const emailContent = {
  //   to: lead.email,
  //   subject: "Thank You for Your Quote Request - CheapCarInsurancePennsylvania.com",
  //   html: `
  //     <h1>Thank You, ${lead.firstName}!</h1>
  //     <p>We've received your car insurance quote request and are matching you with the best providers in Pennsylvania.</p>
  //     <p>You should hear from our partner insurance companies within 24-48 hours.</p>
  //     <p>Quote Reference: #${lead.id}</p>
  //   `
  // };
  
  return true;
}

/**
 * Send follow-up email 24 hours after lead submission
 * This would typically be triggered by a cron job or scheduled task
 */
export async function sendLeadFollowUpEmail(lead: LeadData): Promise<boolean> {
  console.log(`Would send follow-up email to ${lead.email} for lead #${lead.id}`);
  
  // TODO: Integrate with actual email service
  // const emailContent = {
  //   to: lead.email,
  //   subject: "Have You Found the Right Insurance? - CheapCarInsurancePennsylvania.com",
  //   html: `
  //     <h1>Hi ${lead.firstName},</h1>
  //     <p>We wanted to follow up on your quote request from yesterday.</p>
  //     <p>Have you been contacted by our partner insurance companies?</p>
  //     <p>If you need any assistance, please don't hesitate to reach out.</p>
  //   `
  // };
  
  return true;
}
