import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiePolicy() {
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
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              This Cookie Policy explains how CheapCarInsurancePennsylvania.com uses cookies and similar tracking technologies on our website.
            </p>

            <section>
              <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p className="mt-4">
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close your browser, while session cookies are deleted when you close your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
              <p>
                We use cookies and similar tracking technologies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</li>
                <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance and user experience.</li>
                <li><strong>Advertising Cookies:</strong> These cookies are used to deliver advertisements that are relevant to you and your interests. They also help us measure the effectiveness of our advertising campaigns.</li>
                <li><strong>Functionality Cookies:</strong> These cookies enable the website to remember choices you make (such as your preferred language) and provide enhanced, personalized features.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6 mt-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-semibold mb-2">Strictly Necessary Cookies</h3>
                  <p>
                    These cookies are essential for you to navigate the website and use its features. Without these cookies, services you have requested cannot be provided.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Examples: Session management, security features, load balancing
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-semibold mb-2">Performance and Analytics Cookies</h3>
                  <p>
                    These cookies collect information about how visitors use our website, such as which pages are visited most often and if visitors receive error messages. These cookies don't collect information that identifies individual visitors.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Examples: Google Analytics, conversion tracking, form analytics
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-semibold mb-2">Targeting and Advertising Cookies</h3>
                  <p>
                    These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Examples: Google Ads, Facebook Pixel, retargeting pixels
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of our website and deliver advertisements on and through our website. These third parties include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                <li><strong>Google Ads:</strong> To deliver targeted advertising and measure campaign performance</li>
                <li><strong>Facebook:</strong> To deliver social media features and targeted advertising</li>
                <li><strong>Insurance Partners:</strong> To track lead quality and conversion rates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Managing Your Cookie Preferences</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Cookie Consent Banner:</strong> When you first visit our website, you'll see a cookie consent banner where you can accept or customize your cookie preferences.</li>
                <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies.</li>
                <li><strong>Opt-Out Tools:</strong> You can opt out of targeted advertising by visiting the Digital Advertising Alliance's opt-out page at <a href="http://optout.aboutads.info" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
              </ul>
              <p className="mt-4">
                Please note that if you choose to block or delete cookies, some features of our website may not function properly, and your user experience may be affected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Browser-Specific Cookie Management</h2>
              <p>
                Here's how to manage cookies in popular web browsers:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Do Not Track Signals</h2>
              <p>
                Some web browsers have a "Do Not Track" feature that signals to websites that you do not want to have your online activities tracked. Our website does not currently respond to Do Not Track signals, but you can still manage your cookie preferences as described above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Mobile Device Identifiers</h2>
              <p>
                When you access our website through a mobile device, we may collect mobile device identifiers and similar technologies. You can control these through your device settings:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>iOS:</strong> Settings → Privacy → Advertising → Limit Ad Tracking</li>
                <li><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Updates to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p>
                If you have questions or concerns about our use of cookies or this Cookie Policy, please contact us at:
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
                <li><a href="/cookie-policy" className="hover:opacity-100">Cookie Policy</a></li>
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
