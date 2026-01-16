import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export function ExpressQuoteForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitMutation = trpc.leads.submitExpress.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Thank you! We'll call you within 24 hours.");
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setEmail("");
        setPhone("");
        setIsSubmitted(false);
      }, 5000);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !phone) {
      toast.error("Please fill in both email and phone number");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation (at least 10 digits)
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    submitMutation.mutate({ email, phone });
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center border-2 border-green-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          We Got Your Request!
        </h3>
        <p className="text-green-700 text-lg">
          Our team will contact you within 24 hours to discuss your insurance options.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200 shadow-lg">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mb-3">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          In a Hurry? We'll Call You!
        </h3>
        <p className="text-gray-600">
          Just leave your contact info and we'll reach out within 24 hours with personalized quotes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="express-email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <Input
            id="express-email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 text-base"
          />
        </div>

        <div>
          <label htmlFor="express-phone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number
          </label>
          <Input
            id="express-phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="h-12 text-base"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-semibold"
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Submitting...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5 mr-2" />
              Call Me Back
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to be contacted by our partner insurance providers.
        </p>
      </form>
    </div>
  );
}
