import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface AnalyticsProps {
  gtmId?: string;
}

export function Analytics({ gtmId = "GTM-XXXXXXX" }: AnalyticsProps) {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Load GTM script
    const script = document.createElement("script");
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);

    // Add noscript iframe
    const noscript = document.createElement("noscript");
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, [gtmId]);

  return null;
}

/**
 * Track custom events to Google Tag Manager
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }
}

/**
 * Track form step completion
 */
export function trackFormStep(step: number, stepName: string) {
  trackEvent("form_step_completed", {
    step_number: step,
    step_name: stepName,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(leadId: number) {
  trackEvent("lead_submitted", {
    lead_id: leadId,
    conversion: true,
  });
}

/**
 * Track form abandonment
 */
export function trackFormAbandonment(step: number, stepName: string) {
  trackEvent("form_abandoned", {
    step_number: step,
    step_name: stepName,
  });
}
