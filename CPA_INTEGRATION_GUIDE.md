# CPA Network Integration Guide

This guide explains how to integrate CheapCarInsurancePennsylvania.com with CPA networks like MaxBounty, FlexOffers, CJ Affiliate, and others.

## Quick Setup (Recommended)

The easiest way to integrate with a CPA network is to use the **CPA_REDIRECT_URL** environment variable.

### Step 1: Get Your CPA Tracking URL

From your CPA network dashboard (MaxBounty, FlexOffers, etc.), get your unique tracking URL. It will look something like:

```
https://tracking.maxbounty.com/a.ashx?a=12345&c=67890&p=r&s1={subid}
```

Or:

```
https://track.flexoffers.com/click.ashx?foid=12345&fot=9999&foc=1&fobs={subid}
```

### Step 2: Add the URL to Your Environment

1. Go to your project's **Management UI** → **Settings** → **Secrets**
2. Find or add the environment variable: `CPA_REDIRECT_URL`
3. Paste your CPA tracking URL
4. Save

### Step 3: Test the Integration

1. Fill out the quote form on your website
2. Submit the form
3. You should be automatically redirected to your CPA network's tracking URL
4. Check your CPA network dashboard to verify the lead was received

## How It Works

When a user completes the quote form:

1. **Lead is saved** to your database with all form data
2. **Lead is validated** for quality and compliance
3. **User is redirected** to your CPA_REDIRECT_URL
4. **CPA network receives** the lead and tracks the conversion

## Advanced: Multiple CPA Networks

If you want to distribute leads to multiple CPA networks (for A/B testing or load balancing), you can modify the webhook system in `server/webhook.ts`.

### Example: Rotating Between Two Networks

```typescript
// In server/webhook.ts

const CPA_NETWORKS = [
  "https://tracking.maxbounty.com/a.ashx?a=12345&c=67890&p=r",
  "https://track.flexoffers.com/click.ashx?foid=12345&fot=9999&foc=1"
];

let currentNetworkIndex = 0;

export async function distributeLeadToNetworks(lead: any) {
  // Rotate between networks
  const networkUrl = CPA_NETWORKS[currentNetworkIndex];
  currentNetworkIndex = (currentNetworkIndex + 1) % CPA_NETWORKS.length;
  
  // Send lead to network
  // ... (existing code)
}
```

## Tracking Parameters

Most CPA networks support tracking parameters (also called "sub IDs") that you can use to track performance:

- **{subid}** or **{s1}** - Lead ID from your database
- **{source}** - Traffic source (e.g., "google", "facebook")
- **{campaign}** - Campaign name

### Example with Tracking Parameters:

```
https://tracking.maxbounty.com/a.ashx?a=12345&c=67890&p=r&s1={leadId}&s2={source}
```

The system will automatically replace `{leadId}` with the actual lead ID from your database.

## Popular CPA Networks for Insurance Leads

### 1. MaxBounty
- **URL Format:** `https://tracking.maxbounty.com/a.ashx?a=AFFILIATE_ID&c=CAMPAIGN_ID&p=r&s1={subid}`
- **Payout:** $8-$25 per lead (varies by quality)
- **Requirements:** Approved application, compliance with insurance lead guidelines

### 2. FlexOffers
- **URL Format:** `https://track.flexoffers.com/click.ashx?foid=OFFER_ID&fot=9999&foc=1&fobs={subid}`
- **Payout:** $10-$30 per lead
- **Requirements:** Publisher account, insurance vertical approval

### 3. CJ Affiliate (Commission Junction)
- **URL Format:** `https://www.anrdoezrs.net/click-PUBLISHER_ID-ADVERTISER_ID?sid={subid}`
- **Payout:** Varies by advertiser
- **Requirements:** Approved publisher account

### 4. Clickbooth (Perform[cb])
- **URL Format:** `https://www.clickbooth.com/track/click.track?CID=CAMPAIGN_ID&AFID=AFFILIATE_ID&SID={subid}`
- **Payout:** $12-$35 per lead
- **Requirements:** Application approval, insurance compliance

### 5. Aragon Advertising
- **URL Format:** Custom per campaign
- **Payout:** $15-$40 per lead (high quality)
- **Requirements:** Direct relationship, high-quality traffic

## Lead Quality Requirements

Most CPA networks have quality requirements for insurance leads:

✅ **Required:**
- Valid email address
- Valid phone number (10 digits)
- Real name (first and last)
- Valid ZIP code
- Age 18+ (most networks require 21+)
- Currently insured or seeking insurance

❌ **Rejected:**
- Fake/test data
- Duplicate submissions
- Bot traffic
- Invalid contact information
- Underage applicants

## Compliance & Legal

⚠️ **Important:** Make sure your website complies with:

1. **TCPA (Telephone Consumer Protection Act)**
   - Get explicit consent before sharing phone numbers
   - Include clear opt-in language in your form

2. **State Insurance Regulations**
   - Disclose that you're a lead generator, not an insurance company
   - Include required disclaimers

3. **CPA Network Terms**
   - Follow each network's specific guidelines
   - Don't send traffic from prohibited sources

## Testing Your Integration

### Test Checklist:

- [ ] CPA_REDIRECT_URL is set correctly
- [ ] Form submission redirects to CPA network
- [ ] Lead data is saved to database
- [ ] CPA network receives the lead
- [ ] Tracking parameters are passed correctly
- [ ] Test with real data (not fake/test data)

### Test Mode:

To test without sending real leads, you can temporarily set `CPA_REDIRECT_URL` to a test URL like:

```
https://webhook.site/your-unique-url
```

This will show you exactly what data is being sent.

## Monitoring Performance

Track your CPA performance by monitoring:

1. **Lead Volume:** How many leads are you generating?
2. **Conversion Rate:** What % of form starts result in submissions?
3. **CPA Network Acceptance Rate:** What % of leads are accepted?
4. **Revenue:** How much are you earning per lead?

You can view lead data in your database or create a simple admin dashboard.

## Troubleshooting

### Leads Not Redirecting

**Problem:** Users aren't being redirected after form submission

**Solution:**
1. Check that `CPA_REDIRECT_URL` is set in Settings → Secrets
2. Verify the URL is valid and accessible
3. Check browser console for errors

### CPA Network Not Receiving Leads

**Problem:** Redirect works but CPA network shows no conversions

**Solution:**
1. Verify your tracking URL is correct
2. Check that required parameters are included
3. Ensure lead data meets network's quality requirements
4. Contact your CPA network's support team

### Low Acceptance Rate

**Problem:** CPA network is rejecting many leads

**Solution:**
1. Review lead quality requirements
2. Add better validation to your form
3. Implement bot protection (already included)
4. Filter out duplicate submissions

## Support

For technical support with the website:
- Email: david.domainmasterio@gmail.com

For CPA network support:
- Contact your network's affiliate manager directly

## Next Steps

1. ✅ Set up `CPA_REDIRECT_URL` in Settings → Secrets
2. ✅ Test the integration with a real form submission
3. ✅ Monitor your CPA network dashboard for conversions
4. ✅ Optimize your form for higher conversion rates
5. ✅ Scale your traffic with Google Ads, SEO, or other channels

---

**Last Updated:** January 2025
