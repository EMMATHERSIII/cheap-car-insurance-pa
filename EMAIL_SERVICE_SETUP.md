# Email Service Setup Guide

This guide explains how to integrate automated email notifications with your website using popular email service providers.

## Current Status

✅ **Owner Notifications:** Working via Manus notification API
✅ **Social Proof Notifications:** Working on frontend
⏳ **Customer Emails:** Ready to integrate (requires email service)

## Why You Need an Email Service

The website currently has placeholder functions for sending emails to customers:
- Welcome/confirmation email after quote submission
- Follow-up email 24 hours later
- Newsletter functionality

To actually send these emails, you need to integrate with an email service provider.

## Recommended Email Services

### 1. SendGrid (Recommended)

**Why SendGrid:**
- Free tier: 100 emails/day forever
- Easy API integration
- Great deliverability
- Email templates
- Analytics

**Pricing:**
- Free: 100 emails/day
- Essentials: $19.95/month (50,000 emails)
- Pro: $89.95/month (1.5M emails)

**Setup Steps:**

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your sender email address
3. Create an API key
4. Add to your environment variables:

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@cheapcarinsurancepennsylvania.com
SENDGRID_FROM_NAME=Cheap Car Insurance Pennsylvania
```

5. Install SendGrid package:
```bash
cd /home/ubuntu/cheap-car-insurance-pa
pnpm add @sendgrid/mail
```

6. Update `server/email.ts` with SendGrid integration (code provided below)

### 2. AWS SES (Amazon Simple Email Service)

**Why AWS SES:**
- Extremely cheap ($0.10 per 1,000 emails)
- High deliverability
- Scales infinitely
- Integrated with AWS ecosystem

**Pricing:**
- $0.10 per 1,000 emails sent
- $0.12 per GB of attachments

**Setup Steps:**

1. Sign up for AWS account
2. Go to SES console
3. Verify your domain or email
4. Request production access (starts in sandbox mode)
5. Create IAM credentials
6. Add to environment variables:

```bash
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@cheapcarinsurancepennsylvania.com
```

### 3. Mailgun

**Why Mailgun:**
- Developer-friendly API
- Good free tier
- Reliable delivery
- Email validation

**Pricing:**
- Free: 5,000 emails/month for 3 months
- Foundation: $35/month (50,000 emails)

**Setup Steps:**

1. Sign up at [mailgun.com](https://mailgun.com)
2. Add and verify your domain
3. Get API key
4. Add to environment variables:

```bash
MAILGUN_API_KEY=xxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.cheapcarinsurancepennsylvania.com
MAILGUN_FROM_EMAIL=noreply@cheapcarinsurancepennsylvania.com
```

### 4. Resend (Modern Alternative)

**Why Resend:**
- Modern, developer-first
- React email templates
- Great DX (developer experience)
- Simple pricing

**Pricing:**
- Free: 3,000 emails/month
- Pro: $20/month (50,000 emails)

**Setup Steps:**

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key
4. Add to environment variables:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@cheapcarinsurancepennsylvania.com
```

## Implementation Example (SendGrid)

Once you have SendGrid set up, update `server/email.ts`:

```typescript
import sgMail from '@sendgrid/mail';
import { ENV } from "./_core/env";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendLeadConfirmationEmail(lead: LeadData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid not configured, skipping email');
    return false;
  }

  const msg = {
    to: lead.email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || 'noreply@cheapcarinsurancepennsylvania.com',
      name: 'Cheap Car Insurance Pennsylvania'
    },
    subject: 'Thank You for Your Quote Request!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You, ${lead.firstName}!</h1>
          </div>
          <div class="content">
            <p>We've received your car insurance quote request and are matching you with the best providers in Pennsylvania.</p>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our partner insurance companies will review your information</li>
              <li>You'll receive personalized quotes within 24-48 hours</li>
              <li>Compare rates and choose the best option for you</li>
            </ul>
            
            <p><strong>Your Quote Reference:</strong> #${lead.id}</p>
            
            <p>If you have any questions, feel free to reply to this email or visit our website.</p>
            
            <a href="https://cheapcarinsurancepennsylvania.com" class="button">Visit Our Website</a>
          </div>
          <div class="footer">
            <p>CheapCarInsurancePennsylvania.com</p>
            <p>We are a lead generation service that connects you with licensed insurance providers.</p>
            <p><a href="https://cheapcarinsurancepennsylvania.com/privacy">Privacy Policy</a> | <a href="https://cheapcarinsurancepennsylvania.com/terms">Terms of Service</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Thank You, ${lead.firstName}!

We've received your car insurance quote request and are matching you with the best providers in Pennsylvania.

What happens next?
- Our partner insurance companies will review your information
- You'll receive personalized quotes within 24-48 hours
- Compare rates and choose the best option for you

Your Quote Reference: #${lead.id}

If you have any questions, feel free to reply to this email or visit our website at https://cheapcarinsurancepennsylvania.com

CheapCarInsurancePennsylvania.com
    `.trim()
  };

  try {
    await sgMail.send(msg);
    console.log(`Confirmation email sent to ${lead.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

export async function sendLeadFollowUpEmail(lead: LeadData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid not configured, skipping email');
    return false;
  }

  const msg = {
    to: lead.email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || 'noreply@cheapcarinsurancepennsylvania.com',
      name: 'Cheap Car Insurance Pennsylvania'
    },
    subject: 'Have You Found the Right Insurance?',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hi ${lead.firstName},</h1>
          </div>
          <div class="content">
            <p>We wanted to follow up on your insurance quote request from yesterday.</p>
            
            <p><strong>Have you been contacted by our partner insurance companies?</strong></p>
            
            <p>If you haven't received quotes yet, or if you need any assistance, please don't hesitate to reach out. We're here to help!</p>
            
            <p><strong>Quick Tips for Choosing Insurance:</strong></p>
            <ul>
              <li>Compare at least 3 different quotes</li>
              <li>Look beyond the price - check coverage details</li>
              <li>Ask about discounts (safe driver, multi-policy, etc.)</li>
              <li>Read customer reviews of the insurance company</li>
            </ul>
            
            <a href="https://cheapcarinsurancepennsylvania.com/blog" class="button">Read Our Insurance Tips</a>
          </div>
          <div class="footer">
            <p>CheapCarInsurancePennsylvania.com</p>
            <p><a href="https://cheapcarinsurancepennsylvania.com/privacy">Privacy Policy</a> | <a href="https://cheapcarinsurancepennsylvania.com/terms">Terms of Service</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${lead.firstName},

We wanted to follow up on your insurance quote request from yesterday.

Have you been contacted by our partner insurance companies?

If you haven't received quotes yet, or if you need any assistance, please don't hesitate to reach out. We're here to help!

Quick Tips for Choosing Insurance:
- Compare at least 3 different quotes
- Look beyond the price - check coverage details
- Ask about discounts (safe driver, multi-policy, etc.)
- Read customer reviews of the insurance company

Visit our blog for more insurance tips: https://cheapcarinsurancepennsylvania.com/blog

CheapCarInsurancePennsylvania.com
    `.trim()
  };

  try {
    await sgMail.send(msg);
    console.log(`Follow-up email sent to ${lead.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send follow-up email:', error);
    return false;
  }
}
```

## Environment Variables to Add

After choosing your email service, add these to **Settings → Secrets** in the Management UI:

**For SendGrid:**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@cheapcarinsurancepennsylvania.com
SENDGRID_FROM_NAME=Cheap Car Insurance Pennsylvania
```

**For AWS SES:**
```
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@cheapcarinsurancepennsylvania.com
```

**For Mailgun:**
```
MAILGUN_API_KEY=xxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.cheapcarinsurancepennsylvania.com
MAILGUN_FROM_EMAIL=noreply@cheapcarinsurancepennsylvania.com
```

**For Resend:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@cheapcarinsurancepennsylvania.com
```

## Testing Your Email Integration

1. Sign up for your chosen email service
2. Add environment variables in Settings → Secrets
3. Install the required package (`pnpm add @sendgrid/mail` or similar)
4. Update `server/email.ts` with the integration code
5. Test by submitting a quote request on your website
6. Check if you receive the confirmation email

## Follow-Up Email Automation

To send follow-up emails 24 hours after lead submission, you have two options:

### Option 1: Simple Cron Job (Recommended)

Create `server/cron/send-followups.ts`:

```typescript
import { getLeadsFromLast24Hours } from "../db";
import { sendLeadFollowUpEmail } from "../email";

async function sendFollowUpEmails() {
  const leads = await getLeadsFromLast24Hours();
  
  for (const lead of leads) {
    await sendLeadFollowUpEmail(lead);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
}

sendFollowUpEmails().catch(console.error);
```

Run daily with a cron job or scheduled task.

### Option 2: Queue System (Advanced)

Use a job queue like Bull or BullMQ to schedule emails:

```bash
pnpm add bull @types/bull
```

This allows more sophisticated scheduling and retry logic.

## Compliance & Best Practices

✅ **CAN-SPAM Compliance:**
- Include physical address in footer
- Add unsubscribe link
- Use accurate "From" name and email
- Include clear subject lines

✅ **GDPR Compliance (if serving EU customers):**
- Get explicit consent before sending emails
- Provide easy unsubscribe option
- Honor data deletion requests

✅ **Best Practices:**
- Use a dedicated sending domain (e.g., mg.yoursite.com)
- Warm up your domain gradually (start with low volume)
- Monitor bounce rates and spam complaints
- Use email authentication (SPF, DKIM, DMARC)

## Troubleshooting

**Emails going to spam:**
- Verify your domain with your email provider
- Set up SPF, DKIM, and DMARC records
- Avoid spam trigger words
- Include plain text version
- Don't send too many emails too quickly

**Emails not sending:**
- Check API key is correct
- Verify sender email is verified
- Check rate limits
- Look at server logs for errors

## Support

For email service setup help:
- SendGrid: https://docs.sendgrid.com
- AWS SES: https://docs.aws.amazon.com/ses
- Mailgun: https://documentation.mailgun.com
- Resend: https://resend.com/docs

---

**Last Updated:** January 2025
