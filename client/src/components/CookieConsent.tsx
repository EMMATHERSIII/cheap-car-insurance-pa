import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg animate-in slide-in-from-bottom">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">We Value Your Privacy</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized
              insurance quotes. By clicking "Accept All," you consent to our use of cookies.{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={declineCookies} className="whitespace-nowrap">
              Decline
            </Button>
            <Button onClick={acceptCookies} className="whitespace-nowrap">
              Accept All
            </Button>
            <button
              onClick={declineCookies}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
