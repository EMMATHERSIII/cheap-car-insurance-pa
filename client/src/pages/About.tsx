import { Shield, Target, Users, Award, TrendingDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
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

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-muted-foreground">
              We're on a mission to help Pennsylvania drivers save money on car insurance by connecting them with the
              best providers in the market.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg mb-6">
                <p className="font-semibold text-lg mb-2">Important Notice</p>
                <p className="text-foreground">
                  CheapCarInsurancePennsylvania.com is a lead generation and insurance comparison service. We are NOT an insurance company. We connect consumers with licensed insurance providers and may receive compensation for qualified leads.
                </p>
              </div>
              <p>
                CheapCarInsurancePennsylvania.com was founded with a simple yet powerful vision: to make car insurance
                shopping easier, faster, and more transparent for Pennsylvania drivers.
              </p>
              <p>
                We noticed that too many drivers were overpaying for car insurance simply because they didn't have the
                time or resources to compare quotes from multiple providers. The traditional process was time-consuming,
                confusing, and often resulted in people settling for the first quote they received.
              </p>
              <p>
                That's why we created this platform - to empower drivers with the ability to compare quotes from top
                insurance companies in just minutes, completely free of charge. Our technology connects you with
                licensed insurance providers who compete for your business, ensuring you get the best possible rates.
              </p>
              <p>
                Since our launch, we've helped thousands of Pennsylvania drivers save an average of $847 per year on
                their car insurance. We're proud to be a trusted resource for drivers across the state and neighboring
                regions.
              </p>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To help every driver find affordable, comprehensive car insurance coverage through transparent
                comparison and expert guidance.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Values</h3>
              <p className="text-muted-foreground">
                Transparency, integrity, and customer-first service guide everything we do. Your trust is our most
                valuable asset.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Promise</h3>
              <p className="text-muted-foreground">
                We never sell your information. We connect you with trusted providers and let you make the final
                decision.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Save Money</h3>
                  <p className="text-muted-foreground">
                    Our users save an average of $847 per year by comparing quotes from multiple providers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Save Time</h3>
                  <p className="text-muted-foreground">
                    Get quotes from multiple insurance companies in just 2 minutes instead of hours of phone calls.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">100% Secure</h3>
                  <p className="text-muted-foreground">
                    Your personal information is protected with bank-level 256-bit SSL encryption.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Trusted Partners</h3>
                  <p className="text-muted-foreground">
                    We only work with licensed, reputable insurance companies with proven track records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg p-8 md:p-12 text-white mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">50,000+</div>
                <p className="text-white/90">Pennsylvania Drivers Served</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">$847</div>
                <p className="text-white/90">Average Annual Savings</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">4.9/5</div>
                <p className="text-white/90">Customer Satisfaction Rating</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2">Fill Out Our Form</h3>
                <p className="text-muted-foreground">
                  Answer a few quick questions about yourself and your vehicle. Takes less than 2 minutes.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2">Compare Quotes</h3>
                <p className="text-muted-foreground">
                  We match you with top insurance providers who compete for your business with their best rates.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2">Save Money</h3>
                <p className="text-muted-foreground">
                  Choose the best policy for your needs and start saving hundreds of dollars per year.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-accent/50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Save on Car Insurance?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of Pennsylvania drivers who have already saved with us.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <a href="/">Get Your Free Quote Now</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
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
              <p className="text-sm opacity-80 mb-2">
                <strong>Email:</strong><br />
                info@cheapcarinsurancepennsylvania.com
              </p>
              <p className="text-sm opacity-80 mb-2">
                <strong>Service Area:</strong><br />
                Pennsylvania & Surrounding States
              </p>
              <p className="text-sm opacity-80">
                <strong>Hours:</strong><br />
                Monday - Friday: 9 AM - 5 PM EST
              </p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center">
            <p className="text-sm opacity-80 mb-2">&copy; 2025 CheapCarInsurancePennsylvania.com. All rights reserved.</p>
            <p className="text-xs opacity-60">We are not an insurance company. We are a lead generation service that connects consumers with licensed insurance providers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
