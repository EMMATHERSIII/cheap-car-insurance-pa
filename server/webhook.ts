import axios from "axios";
import { Lead } from "../drizzle/schema";

/**
 * Webhook configuration for CPA networks
 * In production, these should be stored in environment variables
 */
interface WebhookConfig {
  url: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

/**
 * Format lead data for CPA network submission
 */
function formatLeadForNetwork(lead: Lead): Record<string, any> {
  return {
    // Personal Information
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    
    // Location
    state: lead.state,
    zip_code: lead.zipCode,
    
    // Vehicle Information
    vehicle_type: lead.vehicleType,
    vehicle_year: lead.vehicleYear,
    ownership_status: lead.ownershipStatus,
    
    // Insurance Information
    current_insurer: lead.currentInsurer,
    coverage_type: lead.coverageType,
    has_recent_accidents: lead.hasRecentAccidents === "yes",
    
    // Demographics
    age: lead.age,
    
    // Tracking Information
    ip_address: lead.ipAddress,
    user_agent: lead.userAgent,
    referrer: lead.referrer,
    utm_source: lead.utmSource,
    utm_medium: lead.utmMedium,
    utm_campaign: lead.utmCampaign,
    
    // Metadata
    lead_id: lead.id,
    created_at: lead.createdAt,
  };
}

/**
 * Send lead to webhook endpoint
 */
export async function sendLeadToWebhook(
  lead: Lead,
  config: WebhookConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = formatLeadForNetwork(lead);
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    
    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`;
    }
    
    const response = await axios.post(config.url, payload, {
      headers,
      timeout: 10000, // 10 second timeout
    });
    
    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    } else {
      return {
        success: false,
        error: `Webhook returned status ${response.status}`,
      };
    }
  } catch (error: any) {
    console.error("Webhook error:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Send lead to multiple CPA networks
 * This can be configured to send to different networks based on lead quality, geo, etc.
 */
export async function distributeLeadToNetworks(lead: Lead): Promise<void> {
  // Example: Configure your CPA network webhooks here
  // In production, these should come from environment variables or database
  
  const networks: Array<{ name: string; config: WebhookConfig }> = [
    // Example configuration (replace with actual webhook URLs)
    // {
    //   name: "MaxBounty",
    //   config: {
    //     url: process.env.MAXBOUNTY_WEBHOOK_URL || "",
    //     apiKey: process.env.MAXBOUNTY_API_KEY,
    //   },
    // },
    // {
    //   name: "FlexOffers",
    //   config: {
    //     url: process.env.FLEXOFFERS_WEBHOOK_URL || "",
    //     apiKey: process.env.FLEXOFFERS_API_KEY,
    //   },
    // },
  ];
  
  // Send to all configured networks in parallel
  const results = await Promise.allSettled(
    networks.map(async (network) => {
      if (!network.config.url) {
        console.log(`Skipping ${network.name}: No webhook URL configured`);
        return;
      }
      
      const result = await sendLeadToWebhook(lead, network.config);
      
      if (result.success) {
        console.log(`Successfully sent lead ${lead.id} to ${network.name}`);
      } else {
        console.error(`Failed to send lead ${lead.id} to ${network.name}: ${result.error}`);
      }
      
      return result;
    })
  );
  
  console.log(`Lead distribution complete for lead ${lead.id}:`, results);
}

/**
 * Validate lead data before sending to networks
 * This helps ensure compliance with CPA network requirements
 */
export function validateLeadForCompliance(lead: Lead): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Email validation
  if (!lead.email || !lead.email.includes("@")) {
    errors.push("Invalid email address");
  }
  
  // Phone validation
  if (!lead.phone || lead.phone.length < 10) {
    errors.push("Invalid phone number");
  }
  
  // Age validation
  if (lead.age < 16 || lead.age > 100) {
    errors.push("Invalid age");
  }
  
  // ZIP code validation
  if (!lead.zipCode || lead.zipCode.length < 5) {
    errors.push("Invalid ZIP code");
  }
  
  // State validation
  if (!lead.state || lead.state.length !== 2) {
    errors.push("Invalid state");
  }
  
  // Required fields
  if (!lead.firstName || !lead.lastName) {
    errors.push("Missing name information");
  }
  
  if (!lead.vehicleType || !lead.vehicleYear) {
    errors.push("Missing vehicle information");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
