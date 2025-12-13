import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("exitPopupShown");
    if (popupShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is moving towards top of page (leaving)
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitPopupShown", "true");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on ESC
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleGetQuote = () => {
    // Scroll to quote form
    const quoteForm = document.querySelector('[data-quote-form]');
    if (quoteForm) {
      quoteForm.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1 hover:bg-white/50 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Wait! Don't Leave Yet
          </h2>

          {/* Subheading */}
          <p className="text-gray-600 mb-6">
            Get your free car insurance quote in just 10 minutes. See how much you could save!
          </p>

          {/* Offer badge */}
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-6">
            <p className="text-sm font-semibold text-yellow-900">
              🎁 Limited Time: Get an extra 10% discount on your first quote
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGetQuote}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Get My Free Quote →
            </Button>

            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              No Thanks, I'll Leave
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3">
              ✓ Free Quote • ✓ No Commitment • ✓ Takes 10 Minutes
            </p>
            <p className="text-xs text-gray-500">
              Join 50,000+ Pennsylvanians who saved money with us
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
