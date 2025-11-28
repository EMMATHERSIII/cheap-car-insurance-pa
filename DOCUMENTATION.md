# CheapCarInsurancePennsylvania.com - Documentation

## Overview

This is a high-performance, CPA-compliant auto-insurance lead generation website designed for the domain CheapCarInsurancePennsylvania.com. The website features a modern multi-step form, conversion tracking, legal compliance, and webhook integration for distributing leads to CPA networks.

## Features

### Multi-Step Lead Form
- **10-step conversion funnel** with progress tracking
- Collects comprehensive lead data:
  - Age, State, ZIP code
  - Vehicle type, year, ownership status
  - Accident history
  - Current insurance information
  - Contact details (name, email, phone)
- **Mobile-first responsive design**
- **Real-time validation** for each step
- **Smooth transitions** between steps
- **UTM parameter tracking** for marketing attribution

### Landing Page
- **Hero section** with strong value proposition
- **Trust indicators**: SSL secured, privacy protected, A+ BBB rating
- **Benefits section** highlighting savings, speed, and protection
- **Social proof**: 4.9/5 rating from 12,847 reviews
- **FAQ section** addressing common concerns
- **How It Works** section explaining the process
- **Responsive design** optimized for all devices

### Tracking & Analytics
- **Google Tag Manager integration** ready (GTM-XXXXXXX placeholder)
- **Event tracking** for:
  - Form step completions
  - Form submissions
  - Form abandonment
  - Conversion events
- **UTM parameter capture** for campaign tracking

### Legal & Compliance
- **Privacy Policy** page (GDPR/CCPA compliant)
- **Terms of Service** page
- **Cookie consent banner** with accept/decline options
- **Compliant footer** with all required links
- **CPA network compliance** standards implemented

### Backend & Database
- **MySQL database** with leads table
- **Lead validation** and sanitization
- **Anti-fraud detection** (suspicious email patterns)
- **IP address and user agent tracking**
- **Webhook integration** for distributing leads to CPA networks
- **Lead status tracking** (new, sent, failed)

## Technology Stack

- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Express 4, tRPC 11
- **Database**: MySQL/TiDB (Drizzle ORM)
- **Authentication**: Manus OAuth (optional, for admin features)
- **Testing**: Vitest
- **Build**: Vite

## Configuration

### Google Tag Manager

To enable Google Tag Manager tracking, update the GTM ID in:
- `client/src/components/Analytics.tsx` - Change `GTM-XXXXXXX` to your actual GTM container ID

### CPA Network Webhooks

To configure webhook integration with CPA networks, edit `server/webhook.ts`:

```typescript
const networks: Array<{ name: string; config: WebhookConfig }> = [
  {
    name: "MaxBounty",
    config: {
      url: process.env.MAXBOUNTY_WEBHOOK_URL || "",
      apiKey: process.env.MAXBOUNTY_API_KEY,
    },
  },
  {
    name: "FlexOffers",
    config: {
      url: process.env.FLEXOFFERS_WEBHOOK_URL || "",
      apiKey: process.env.FLEXOFFERS_API_KEY,
    },
  },
  // Add more networks as needed
];
```

Then add the corresponding environment variables through the Manus UI (Settings → Secrets):
- `MAXBOUNTY_WEBHOOK_URL`
- `MAXBOUNTY_API_KEY`
- `FLEXOFFERS_WEBHOOK_URL`
- `FLEXOFFERS_API_KEY`

### Lead Data Format

Leads are sent to webhooks in the following format:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "5551234567",
  "state": "PA",
  "zip_code": "19101",
  "vehicle_type": "Sedan",
  "vehicle_year": 2020,
  "ownership_status": "owned",
  "current_insurer": "State Farm",
  "coverage_type": "Full Coverage",
  "has_recent_accidents": false,
  "age": 35,
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "referrer": "https://google.com",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "insurance-pa",
  "lead_id": 123,
  "created_at": "2025-11-28T12:00:00.000Z"
}
```

## CPA Network Compliance

The website is designed to meet compliance requirements for all major CPA networks including:

- MaxBounty, FlexOffers, CJ, Impact Radius
- Admitad, ClickDealer, Leadigo, AdGate Media
- PeerFly, Madrivo, W4, GlobalWide Media
- Rakuten Advertising, A4D, CrakRevenue, MundoMedia
- FireAds, Mobidea, TradeTracker, Perform[cb]
- Convert2Media, Panthera Network, CPALead, CPAHouse
- Mobipium, TerraLeads, RevenueWire, AffiliaXe
- Admitad Partner Network, PayPerLead.com

**Compliance features:**
- SSL encryption for data transmission
- Privacy Policy and Terms of Service
- GDPR/CCPA compliance notices
- Cookie consent mechanism
- Transparent data collection practices
- No hidden fees or obligations
- Clear disclosure of data sharing with insurance providers

## Database Schema

### Leads Table

```sql
CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- Form data
  age INT NOT NULL,
  state VARCHAR(2) NOT NULL,
  zipCode VARCHAR(10) NOT NULL,
  vehicleType VARCHAR(100) NOT NULL,
  vehicleYear INT NOT NULL,
  hasRecentAccidents ENUM('yes', 'no') NOT NULL,
  currentInsurer VARCHAR(200) NOT NULL,
  coverageType VARCHAR(100) NOT NULL,
  ownershipStatus ENUM('financed', 'owned', 'leased') NOT NULL,
  -- Contact details
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  -- Tracking & metadata
  ipAddress VARCHAR(45),
  userAgent TEXT,
  referrer TEXT,
  utmSource VARCHAR(200),
  utmMedium VARCHAR(200),
  utmCampaign VARCHAR(200),
  -- Status tracking
  status ENUM('new', 'sent', 'failed') DEFAULT 'new' NOT NULL,
  sentToNetwork VARCHAR(200),
  sentAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);
```

## API Endpoints

### Lead Submission

**Endpoint**: `POST /api/trpc/leads.submit`

**Request Body**:
```json
{
  "age": 35,
  "state": "PA",
  "zipCode": "19101",
  "vehicleType": "Sedan",
  "vehicleYear": 2020,
  "hasRecentAccidents": "no",
  "currentInsurer": "State Farm",
  "coverageType": "Full Coverage",
  "ownershipStatus": "owned",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "5551234567",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "insurance-pa"
}
```

**Response**:
```json
{
  "success": true,
  "leadId": 123
}
```

## Testing

Run the test suite:

```bash
pnpm test
```

Tests include:
- Lead submission validation
- Age range validation
- Email format validation
- State code validation
- Required fields validation
- Tracking information capture

## Performance Optimization

- **Lazy loading** for images and components
- **Code splitting** with Vite
- **Optimized fonts** with Google Fonts preconnect
- **Minimal dependencies** for fast load times
- **Mobile-first design** for optimal mobile performance
- **Progressive enhancement** approach

## SEO Features

- Comprehensive meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Card tags
- Geo-targeting tags for Pennsylvania
- Semantic HTML structure
- Mobile-friendly design
- Fast page load times

## Security Features

- **SSL/TLS encryption** (handled by hosting platform)
- **Input validation** on all form fields
- **SQL injection prevention** via Drizzle ORM
- **XSS protection** via React's built-in escaping
- **CSRF protection** via tRPC
- **Rate limiting** (can be added via middleware)

## Deployment

The website is deployed on the Manus platform. To publish:

1. Save a checkpoint (already done)
2. Click the "Publish" button in the Manus UI
3. Configure your custom domain (CheapCarInsurancePennsylvania.com) in Settings → Domains

## Monitoring

Access lead data through the Manus Database UI:
- View all submitted leads
- Track lead status (new, sent, failed)
- Monitor conversion rates
- Analyze UTM campaign performance

## Support & Maintenance

### Adding New Insurance Companies

Edit `client/src/components/MultiStepForm.tsx` and add to the `INSURANCE_COMPANIES` array.

### Updating Legal Pages

Edit:
- `client/src/pages/Privacy.tsx` for Privacy Policy
- `client/src/pages/Terms.tsx` for Terms of Service

### Customizing Form Steps

Edit `client/src/components/MultiStepForm.tsx` to add, remove, or modify form steps.

### Fraud Detection

Edit `server/routers.ts` to add more suspicious patterns to the `suspiciousPatterns` array.

## License

This project is proprietary software created for CheapCarInsurancePennsylvania.com.

## Contact

For technical support or questions, contact the development team.
