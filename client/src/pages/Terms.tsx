import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: November 28, 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using CheapCarInsurancePennsylvania.com (the "Website"), you agree to be bound by these
              Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Website.
            </p>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. Your continued use of the Website after any
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              CheapCarInsurancePennsylvania.com is an online platform that connects consumers with insurance providers.
              We provide a free service that allows you to request and compare auto insurance quotes from multiple
              licensed insurance companies.
            </p>
            <p className="text-muted-foreground">
              We are not an insurance company and do not provide insurance directly. We act as an intermediary between
              you and insurance providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              To use our services, you must:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Be at least 16 years of age</li>
              <li>Be a resident of the United States</li>
              <li>Provide accurate and complete information</li>
              <li>Have the legal capacity to enter into binding contracts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. User Obligations</h2>
            <p className="text-muted-foreground mb-4">When using our Website, you agree to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the accuracy of your information</li>
              <li>Not use the Website for any unlawful purpose</li>
              <li>Not submit false, misleading, or fraudulent information</li>
              <li>Not attempt to interfere with the proper functioning of the Website</li>
              <li>Not use automated systems to access the Website without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Quote Requests and Insurance Providers</h2>
            <p className="text-muted-foreground mb-4">
              When you submit a quote request through our Website:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                You authorize us to share your information with insurance providers to obtain quotes on your behalf
              </li>
              <li>Insurance providers may contact you via phone, email, or mail regarding insurance products</li>
              <li>We do not guarantee that you will receive quotes from any specific number of providers</li>
              <li>Quote availability and pricing are determined solely by the insurance providers</li>
              <li>We are not responsible for the accuracy of quotes provided by insurance companies</li>
            </ul>
            <p className="text-muted-foreground">
              Any insurance policy you purchase is a contract between you and the insurance provider, not with
              CheapCarInsurancePennsylvania.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. No Obligation to Purchase</h2>
            <p className="text-muted-foreground">
              Requesting quotes through our Website does not obligate you to purchase insurance. You are free to
              compare quotes and make your own decision about whether to purchase a policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Fees and Compensation</h2>
            <p className="text-muted-foreground mb-4">
              Our service is free for consumers. We do not charge you any fees for requesting or receiving insurance
              quotes.
            </p>
            <p className="text-muted-foreground">
              We may receive compensation from insurance providers when you purchase a policy through our service. This
              compensation does not affect the quotes you receive or the price you pay for insurance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content on the Website, including text, graphics, logos, images, and software, is the property of
              CheapCarInsurancePennsylvania.com or its licensors and is protected by copyright, trademark, and other
              intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              You may not reproduce, distribute, modify, or create derivative works from any content on the Website
              without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground mb-4">
              THE WEBSITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the Website will be uninterrupted, error-free, or secure</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of information</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
            <p className="text-muted-foreground">
              We do not warrant or guarantee that you will receive insurance quotes or that any quotes will meet your
              needs or expectations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHEAPCARINSURANCEPENNSYLVANIA.COM SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Damages resulting from your use or inability to use the Website</li>
              <li>Damages resulting from any insurance policy purchased through our service</li>
              <li>Damages resulting from actions or omissions of insurance providers</li>
            </ul>
            <p className="text-muted-foreground">
              Our total liability to you for any claims arising from your use of the Website shall not exceed $100.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless CheapCarInsurancePennsylvania.com, its affiliates,
              officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses
              (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Your use of the Website</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Any false or misleading information you provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Third-Party Links and Services</h2>
            <p className="text-muted-foreground">
              The Website may contain links to third-party websites or services. We are not responsible for the
              content, privacy practices, or terms of service of any third-party websites. Your interactions with
              third-party websites are solely between you and the third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Privacy</h2>
            <p className="text-muted-foreground">
              Your use of the Website is also governed by our Privacy Policy, which is incorporated into these Terms by
              reference. Please review our Privacy Policy to understand how we collect, use, and protect your
              information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your access to the Website at any time, with or without
              notice, for any reason, including violation of these Terms. Upon termination, your right to use the
              Website will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Governing Law and Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the Commonwealth of
              Pennsylvania, without regard to its conflict of law provisions.
            </p>
            <p className="text-muted-foreground mb-4">
              Any disputes arising from these Terms or your use of the Website shall be resolved through binding
              arbitration in accordance with the rules of the American Arbitration Association, except that either
              party may seek injunctive relief in court.
            </p>
            <p className="text-muted-foreground">
              You waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">16. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall
              remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">17. Entire Agreement</h2>
            <p className="text-muted-foreground">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and
              CheapCarInsurancePennsylvania.com regarding your use of the Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">18. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms, please contact us at:
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <p className="font-semibold mb-2">CheapCarInsurancePennsylvania.com</p>
              <p className="text-muted-foreground">Email: legal@cheapcarinsurancepennsylvania.com</p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">&copy; 2025 CheapCarInsurancePennsylvania.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
