import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Disclaimer() {
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
          <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="font-semibold text-lg mb-2">Important Notice</p>
              <p className="text-foreground">
                CheapCarInsurancePennsylvania.com is NOT an insurance company. We are an insurance lead generation and comparison service that connects consumers with licensed insurance providers.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4">Nature of Our Service</h2>
              <p>
                CheapCarInsurancePennsylvania.com operates as a lead generation platform and insurance comparison service. We do not sell, underwrite, or provide insurance policies directly. Instead, we:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Collect information from consumers seeking car insurance quotes</li>
                <li>Match consumers with licensed insurance providers and agents</li>
                <li>Facilitate connections between consumers and insurance companies</li>
                <li>Provide educational content about car insurance options</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">No Insurance Advice</h2>
              <p>
                The information provided on this website is for general informational purposes only and should not be construed as professional insurance advice. We are not licensed insurance agents or brokers. Any decisions you make regarding insurance coverage should be made in consultation with a licensed insurance professional who can assess your specific needs and circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Relationships</h2>
              <p>
                When you submit your information through our quote form, we may share your details with one or more licensed insurance providers, agents, or partner networks. These third parties are independent entities, and we do not control their operations, pricing, or services. Any insurance policy you purchase will be directly between you and the insurance provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Compensation Disclosure</h2>
              <p>
                CheapCarInsurancePennsylvania.com may receive compensation from insurance providers, agents, or affiliate networks when we successfully connect consumers with their services. This compensation may be in the form of:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Lead generation fees for qualified consumer inquiries</li>
                <li>Referral commissions when consumers purchase policies</li>
                <li>Advertising fees from insurance providers</li>
              </ul>
              <p className="mt-4">
                Our compensation does not affect the price you pay for insurance. Insurance rates are determined by the insurance providers based on their underwriting criteria and state regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">No Guarantee of Coverage or Rates</h2>
              <p>
                We cannot guarantee that you will receive insurance quotes, qualify for coverage, or receive any specific rate. Insurance eligibility and pricing are determined solely by the insurance providers based on their underwriting guidelines, your personal information, driving history, and other factors.
              </p>
              <p className="mt-4">
                The quotes and estimates provided through our service are subject to verification and may change based on additional information provided during the application process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Accuracy of Information</h2>
              <p>
                While we strive to provide accurate and up-to-date information on our website, we make no warranties or representations regarding the accuracy, completeness, or reliability of any content. Insurance laws, regulations, and requirements vary by state and change frequently. You should verify all information with licensed insurance professionals and relevant state authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">State-Specific Information</h2>
              <p>
                Although our primary focus is Pennsylvania, we may provide information about car insurance in other states. Insurance requirements, regulations, and available coverage options vary significantly by state. The information provided is general in nature and may not reflect the specific requirements or options available in your state.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">External Links</h2>
              <p>
                Our website may contain links to third-party websites, including insurance provider websites. We are not responsible for the content, privacy practices, or services of these external sites. Your interactions with third-party websites are governed by their own terms and conditions and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p>
                CheapCarInsurancePennsylvania.com and its owners, operators, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your use of our website or services</li>
                <li>Any insurance policy you purchase or fail to purchase</li>
                <li>Actions or omissions of third-party insurance providers</li>
                <li>Errors or omissions in the information provided on our website</li>
                <li>Any delay or failure in receiving quotes or coverage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to This Disclaimer</h2>
              <p>
                We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to our website. Your continued use of our website following any changes constitutes acceptance of the updated disclaimer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p>
                If you have questions about this disclaimer or our services, please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> info@cheapcarinsurancepennsylvania.com
              </p>
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
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="/privacy" className="hover:opacity-100">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:opacity-100">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:opacity-100">Disclaimer</a></li>
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
