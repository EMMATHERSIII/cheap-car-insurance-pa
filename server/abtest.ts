import { getActiveAbTestVariants, getDefaultAbTestVariant } from "./db";
import type { AbTestVariant } from "../drizzle/schema";

/**
 * Assign a visitor to an A/B test variant
 * Uses random assignment for active variants, or returns default if set
 */
export async function assignVariant(sessionId: string): Promise<AbTestVariant | null> {
  // Check if there's a default variant set
  const defaultVariant = await getDefaultAbTestVariant();
  if (defaultVariant) {
    return defaultVariant;
  }
  
  // Get all active variants
  const activeVariants = await getActiveAbTestVariants();
  
  if (activeVariants.length === 0) {
    return null;
  }
  
  if (activeVariants.length === 1) {
    return activeVariants[0]!;
  }
  
  // Random assignment based on session ID hash
  const hash = hashString(sessionId);
  const index = hash % activeVariants.length;
  
  return activeVariants[index]!;
}

/**
 * Simple string hash function for consistent variant assignment
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate or retrieve session ID from cookie/localStorage
 */
export function getOrCreateSessionId(): string {
  // This will be called from the client side
  if (typeof window === "undefined") {
    return "";
  }
  
  const storageKey = "ab_test_session_id";
  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}
