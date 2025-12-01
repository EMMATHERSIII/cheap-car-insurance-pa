import { Shield, FileText, Search, Users, CheckCircle, Clock, DollarSign, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorks() {
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
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Finding affordable car insurance in Pennsylvania is simple with our free quote comparison service. Here's how we help you save money and time.
            </p>
          </div>
        </div>
      </section>

      {/* Main Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Get Quotes in 3 Easy Steps</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>1. Fill Out Our Form</CardTitle>
                  <CardDescription>Takes just 2 minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Answer a few simple questions about yourself, your vehicle, and your coverage needs. Our secure form is quick and easy to complete.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>2. We Match You</CardTitle>
                  <CardDescription>Instant matching</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our system instantly matches your profile with licensed insurance providers in Pennsylvania who can offer you competitive rates.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>3. Compare & Choose</CardTitle>
                  <CardDescription>You're in control</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Insurance providers will contact you with personalized quotes. Compare rates, coverage options, and choose the best policy for your needs.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <a href="/">Get Started Now →</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
            
            <div className="space-y-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <CheckCircle className="w-6 h-6 text-primary mr-3" />
                  We Connect You with Licensed Providers
                </h3>
                <p className="text-muted-foreground ml-9">
                  CheapCarInsurancePennsylvania.com is a lead generation and comparison service. We partner with licensed insurance companies, agents, and brokers throughout Pennsylvania to help you find competitive rates. We are NOT an insurance company ourselves.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <Search className="w-6 h-6 text-primary mr-3" />
                  We Make Comparison Easy
                </h3>
                <p className="text-muted-foreground ml-9">
                  Instead of visiting multiple insurance websites and filling out the same information repeatedly, you complete one simple form. We share your information with multiple providers so you can receive and compare multiple quotes.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <Lock className="w-6 h-6 text-primary mr-3" />
                  We Protect Your Privacy
                </h3>
                <p className="text-muted-foreground ml-9">
                  Your information is transmitted securely and only shared with licensed insurance providers who can offer you quotes. We never sell your information to unrelated third parties. See our Privacy Policy for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Happens After You Submit?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Instant Confirmation</h3>
                  <p className="text-muted-foreground">
                    You'll see a confirmation message immediately after submitting your information. Your request has been received and is being processed.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Provider Matching</h3>
                  <p className="text-muted-foreground">
                    Our system matches your profile with insurance providers who serve your area and can offer coverage that meets your needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">You'll Be Contacted</h3>
                  <p className="text-muted-foreground">
                    Insurance providers will contact you (typically by phone or email) to provide personalized quotes and discuss coverage options. This usually happens within 24-48 hours, but may be faster.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Compare and Decide</h3>
                  <p className="text-muted-foreground">
                    Review the quotes you receive, ask questions, and choose the policy that offers the best combination of coverage and price for your situation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Purchase Your Policy</h3>
                  <p className="text-muted-foreground">
                    Once you've chosen a provider, you'll work directly with them to complete your application and purchase your policy. Your insurance contract will be between you and the insurance company.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use Our Service?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Save Time</h3>
                  <p className="text-sm text-muted-foreground">
                    One form instead of visiting multiple insurance websites
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Save Money</h3>
                  <p className="text-sm text-muted-foreground">
                    Compare multiple quotes to find the best rate
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">
                    Your information is protected and only shared with licensed providers
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">100% Free</h3>
                  <p className="text-sm text-muted-foreground">
                    Our service is completely free - no hidden fees or obligations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Important Information</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>We Are Not an Insurance Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    CheapCarInsurancePennsylvania.com is a lead generation and comparison service. We do not sell, underwrite, or provide insurance policies. All insurance policies are issued by licensed insurance companies, and your contract will be directly with them.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>No Guarantee of Quotes or Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    While we work with multiple providers, we cannot guarantee that you will receive quotes or qualify for coverage. Insurance eligibility and rates are determined by the insurance providers based on their underwriting criteria.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>You May Be Contacted by Multiple Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    When you submit your information, it may be shared with multiple insurance providers. This means you may receive calls or emails from several companies. This gives you more options to compare.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Best Rate?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get started now and receive personalized quotes in minutes.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <a href="/">Get My Free Quote →</a>
          </Button>
        </div>
      </section>

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
