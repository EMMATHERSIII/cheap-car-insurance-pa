import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

interface AbTestVariant {
  id: number;
  name: string;
  headline: string;
  subheadline: string | null;
  ctaText: string;
  description: string | null;
  isActive: string;
  isDefault: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useAbTest() {
  const [sessionId, setSessionId] = useState<string>("");
  const [variant, setVariant] = useState<AbTestVariant | null>(null);

  // Get or create session ID
  useEffect(() => {
    const storageKey = "ab_test_session_id";
    let id = localStorage.getItem(storageKey);
    
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem(storageKey, id);
    }
    
    setSessionId(id);
  }, []);

  // Get assigned variant
  const { data: assignedVariant } = trpc.abtest.getVariant.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  // Track view mutation
  const trackView = trpc.abtest.trackView.useMutation();
  
  // Track conversion mutation
  const trackConversion = trpc.abtest.trackConversion.useMutation();

  // Set variant and track view
  useEffect(() => {
    if (assignedVariant && sessionId) {
      setVariant(assignedVariant);
      
      // Track view event
      trackView.mutate({
        variantId: assignedVariant.id,
        sessionId,
        ipAddress: undefined,
        userAgent: navigator.userAgent,
      });
    }
  }, [assignedVariant, sessionId]);

  // Function to track conversion
  const recordConversion = (leadId: number) => {
    if (variant && sessionId) {
      trackConversion.mutate({
        variantId: variant.id,
        sessionId,
        leadId,
        ipAddress: undefined,
        userAgent: navigator.userAgent,
      });
    }
  };

  return {
    variant,
    recordConversion,
    isLoading: !variant && !!sessionId,
  };
}
