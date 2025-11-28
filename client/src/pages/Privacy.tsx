import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
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
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: November 28, 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              CheapCarInsurancePennsylvania.com ("we," "our," or "us") is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
              website and use our services.
            </p>
            <p className="text-muted-foreground">
              By using our website, you consent to the data practices described in this policy. If you do not agree
              with the terms of this Privacy Policy, please do not access or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <p className="text-muted-foreground mb-4">
              We collect personal information that you voluntarily provide to us when you request an insurance quote or
              express interest in obtaining information about our services. The personal information we collect may
              include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Name (first and last)</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>State and ZIP code</li>
              <li>Age</li>
              <li>Vehicle information (type, year, ownership status)</li>
              <li>Current insurance information</li>
              <li>Accident history</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
            <p className="text-muted-foreground mb-4">
              When you visit our website, we automatically collect certain information about your device and browsing
              actions, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages visited and time spent on pages</li>
              <li>UTM parameters and marketing campaign data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide you with insurance quotes from our network of insurance providers</li>
              <li>Match you with appropriate insurance companies based on your profile</li>
              <li>Communicate with you about insurance options and services</li>
              <li>Improve our website and services</li>
              <li>Analyze website usage and trends</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. How We Share Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We may share your information with third parties in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold mb-3">Insurance Providers</h3>
            <p className="text-muted-foreground mb-4">
              We share your information with licensed insurance companies and agents to provide you with insurance
              quotes. These companies may contact you directly via phone, email, or mail regarding insurance products.
            </p>

            <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
            <p className="text-muted-foreground mb-4">
              We may share your information with third-party service providers who perform services on our behalf, such
              as data analysis, email delivery, hosting services, and customer service.
            </p>

            <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
            <p className="text-muted-foreground mb-4">
              We may disclose your information if required to do so by law or in response to valid requests by public
              authorities (e.g., a court or government agency).
            </p>

            <h3 className="text-xl font-semibold mb-3">Business Transfers</h3>
            <p className="text-muted-foreground">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the
              acquiring entity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to track activity on our website and store certain
              information. Cookies are files with a small amount of data that may include an anonymous unique
              identifier.
            </p>
            <p className="text-muted-foreground mb-4">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.</p>
            <p className="text-muted-foreground">
              We use Google Tag Manager and other analytics tools to help us understand how visitors use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
            </ul>
            <p className="text-muted-foreground">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we
              strive to use commercially acceptable means to protect your information, we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Your Privacy Rights</h2>
            <p className="text-muted-foreground mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                <strong>Access:</strong> You can request a copy of the personal information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> You can request that we correct inaccurate or incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> You can request that we delete your personal information
              </li>
              <li>
                <strong>Opt-Out:</strong> You can opt out of receiving marketing communications from us
              </li>
              <li>
                <strong>Do Not Sell:</strong> You can request that we do not sell your personal information (California
                residents)
              </li>
            </ul>
            <p className="text-muted-foreground">
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. California Privacy Rights (CCPA)</h2>
            <p className="text-muted-foreground mb-4">
              If you are a California resident, you have specific rights under the California Consumer Privacy Act
              (CCPA), including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>The right to know what personal information we collect, use, disclose, and sell</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to opt-out of the sale of your personal information</li>
              <li>The right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="text-muted-foreground">
              We do not discriminate against users who exercise their CCPA rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. European Privacy Rights (GDPR)</h2>
            <p className="text-muted-foreground mb-4">
              If you are located in the European Economic Area (EEA), you have rights under the General Data Protection
              Regulation (GDPR), including the right to access, rectify, erase, restrict processing, data portability,
              and to object to processing of your personal data.
            </p>
            <p className="text-muted-foreground">
              You also have the right to lodge a complaint with a supervisory authority if you believe we have
              processed your personal data unlawfully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for individuals under the age of 16. We do not knowingly collect personal
              information from children under 16. If you become aware that a child has provided us with personal
              information, please contact us, and we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Third-Party Links</h2>
            <p className="text-muted-foreground">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices
              or content of these third-party sites. We encourage you to review the privacy policies of any third-party
              sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
              Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <p className="font-semibold mb-2">CheapCarInsurancePennsylvania.com</p>
              <p className="text-muted-foreground">Email: privacy@cheapcarinsurancepennsylvania.com</p>
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
