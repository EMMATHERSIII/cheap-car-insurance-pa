import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">CheapCarInsurancePennsylvania.com</h1>
                <p className="text-xs text-muted-foreground">Your Trusted Insurance Partner</p>
              </div>
            </a>
            <Button asChild>
              <a href="/">Get Free Quote</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="font-semibold text-lg mb-2">Important Notice</p>
              <p className="text-foreground">
                CheapCarInsurancePennsylvania.com is a FREE lead generation and comparison service. We do not charge consumers any fees for using our service. This policy explains our service terms and insurance policy cancellation information.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4">Our Service is 100% Free</h2>
              <p>
                CheapCarInsurancePennsylvania.com does not charge consumers any fees to use our quote comparison service. There are:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>No sign-up fees</li>
                <li>No subscription fees</li>
                <li>No service charges</li>
                <li>No hidden costs</li>
              </ul>
              <p className="mt-4">
                Because we do not charge any fees, there are no refunds to process for our service. You can use our comparison service at no cost and with no financial obligation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">No Purchase Required</h2>
              <p>
                Using our service does not obligate you to purchase any insurance policy. You are free to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Review quotes from multiple providers</li>
                <li>Compare rates and coverage options</li>
                <li>Decline any or all offers</li>
                <li>Walk away at any time with no penalty</li>
              </ul>
              <p className="mt-4">
                The decision to purchase insurance is entirely yours, and you are under no obligation to accept any quote or offer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Canceling Your Quote Request</h2>
              <p>
                If you've submitted a quote request through our website and wish to cancel it:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Before Providers Contact You:</strong> Simply don't respond to any calls or emails you receive from insurance providers. Your information will not be used further.</li>
                <li><strong>After Being Contacted:</strong> You can inform the insurance providers directly that you're no longer interested. Each provider has their own process for removing you from their contact list.</li>
                <li><strong>Stop All Contact:</strong> If you wish to stop receiving communications, you can contact us at info@cheapcarinsurancepennsylvania.com, and we'll do our best to assist you.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Insurance Policy Cancellations</h2>
              <p>
                If you purchase an insurance policy through one of our partner providers and later wish to cancel it, you must contact the insurance company directly. We are not involved in policy administration, and we cannot process policy cancellations.
              </p>
              <p className="mt-4">
                <strong>Important Points About Insurance Cancellations:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Contact Your Insurer:</strong> All cancellation requests must go through your insurance company, not through CheapCarInsurancePennsylvania.com</li>
                <li><strong>Cancellation Terms:</strong> Each insurance company has its own cancellation policy, which will be outlined in your policy documents</li>
                <li><strong>Refunds:</strong> Many insurers offer pro-rated refunds if you cancel before your policy term ends, but this varies by company and state regulations</li>
                <li><strong>Cancellation Fees:</strong> Some insurers may charge a cancellation fee. Check your policy documents for details</li>
                <li><strong>Coverage Gap:</strong> Be aware that canceling your policy may leave you without coverage. Pennsylvania law requires continuous auto insurance coverage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Pennsylvania Insurance Requirements</h2>
              <p>
                Pennsylvania law requires all registered vehicles to maintain continuous auto insurance coverage. If you cancel your policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>You must have replacement coverage in place to avoid penalties</li>
                <li>Driving without insurance can result in fines, license suspension, and registration suspension</li>
                <li>A lapse in coverage may increase your future insurance rates</li>
              </ul>
              <p className="mt-4">
                Before canceling any policy, ensure you have new coverage starting immediately to maintain continuous protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Typical Insurance Cancellation Process</h2>
              <p>
                While we cannot cancel policies on your behalf, here's the general process for canceling an auto insurance policy:
              </p>
              <ol className="list-decimal pl-6 space-y-3 mt-4">
                <li>
                  <strong>Review Your Policy:</strong> Check your policy documents for cancellation terms, notice requirements, and any potential fees
                </li>
                <li>
                  <strong>Secure New Coverage:</strong> If you're switching insurers, purchase your new policy before canceling the old one
                </li>
                <li>
                  <strong>Contact Your Insurer:</strong> Call your insurance company's customer service or contact your agent directly
                </li>
                <li>
                  <strong>Submit Written Request:</strong> Many insurers require written cancellation requests. Follow their specific procedures
                </li>
                <li>
                  <strong>Specify Cancellation Date:</strong> Indicate when you want the cancellation to take effect (usually the start date of your new policy)
                </li>
                <li>
                  <strong>Request Confirmation:</strong> Get written confirmation of your cancellation and any refund amount
                </li>
                <li>
                  <strong>Return Documents:</strong> If required, return your insurance ID cards and any other documents
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Opting Out of Communications</h2>
              <p>
                If you no longer wish to receive communications from insurance providers after submitting a quote request:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Email Communications:</strong> Use the "unsubscribe" link in emails from providers</li>
                <li><strong>Phone Calls:</strong> Ask to be placed on the provider's do-not-call list</li>
                <li><strong>Text Messages:</strong> Reply "STOP" to opt out of text messages</li>
                <li><strong>Multiple Providers:</strong> You may need to opt out with each provider individually</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Removal Requests</h2>
              <p>
                If you wish to have your information removed from our systems, you can submit a data removal request by contacting us at info@cheapcarinsurancepennsylvania.com. Please include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your full name</li>
                <li>Email address used for the quote request</li>
                <li>Phone number (if provided)</li>
                <li>Approximate date of submission</li>
              </ul>
              <p className="mt-4">
                We will process your request in accordance with applicable privacy laws. Note that we cannot remove information from insurance providers' systems once it has been shared with them - you must contact them directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Questions or Concerns</h2>
              <p>
                If you have questions about this policy or need assistance with any aspect of our service, please contact us:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> info@cheapcarinsurancepennsylvania.com
              </p>
              <p className="mt-4">
                For questions about insurance policies you've purchased, please contact your insurance provider directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Important Reminders</h2>
              <div className="bg-muted p-6 rounded-lg space-y-3">
                <p className="font-semibold">Please Remember:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Our service is completely free - no charges, no refunds needed</li>
                  <li>We are not an insurance company and cannot cancel insurance policies</li>
                  <li>You have no obligation to purchase any insurance through our service</li>
                  <li>All insurance policy matters must be handled directly with the insurance company</li>
                  <li>Maintain continuous coverage to comply with Pennsylvania law</li>
                </ul>
              </div>
            </section>

            <div className="bg-muted p-6 rounded-lg mt-8">
              <p className="text-sm">
                <strong>Last Updated:</strong> January 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6" />
                <span className="font-bold">CheapCarInsurancePennsylvania.com</span>
              </div>
              <p className="text-sm opacity-80">
                Your trusted partner for finding affordable car insurance in Pennsylvania.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="/" className="hover:opacity-100">Home</a></li>
                <li><a href="/blog" className="hover:opacity-100">Blog</a></li>
                <li><a href="/about" className="hover:opacity-100">About Us</a></li>
                <li><a href="/contact" className="hover:opacity-100">Contact</a></li>
                <li><a href="/how-it-works" className="hover:opacity-100">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="/privacy" className="hover:opacity-100">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:opacity-100">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:opacity-100">Disclaimer</a></li>
                <li><a href="/cookie-policy" className="hover:opacity-100">Cookie Policy</a></li>
                <li><a href="/refund-policy" className="hover:opacity-100">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-sm opacity-80">
                Email: info@cheapcarinsurancepennsylvania.com
              </p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center">
            <p className="text-sm opacity-80">&copy; 2025 CheapCarInsurancePennsylvania.com. All rights reserved.</p>
            <p className="text-xs opacity-60 mt-2">We are not an insurance company. We are a lead generation service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
