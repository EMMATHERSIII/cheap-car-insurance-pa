import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, DollarSign, Clock, CheckCircle, Star, Users, Award, Lock } from "lucide-react";
import { useAbTest } from "@/hooks/useAbTest";
import MultiStepForm from "@/components/MultiStepForm";
import { Schema } from "@/components/Schema";
import { SocialProofNotification } from "@/components/SocialProofNotification";
function BlogPreview() {
  const { data: posts, isLoading } = trpc.blog.recent.useQuery({ limit: 3 });

  if (isLoading || !posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Latest Insurance Tips & News</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with expert advice on saving money and choosing the right car insurance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                    </div>
                    <div className="flex items-center text-primary font-semibold">
                      Read more <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/blog"
            className="inline-flex items-center text-primary font-semibold hover:underline"
          >
            View all articles <ChevronRight className="w-5 h-5 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { variant, recordConversion } = useAbTest();
  
  // Store variant ID globally for MultiStepForm to access
  if (variant) {
    (window as any).__abTestVariantId = variant.id;
    (window as any).__recordAbTestConversion = recordConversion;
  }
  
  // Default content if no variant is assigned
  const headline = variant?.headline || "Save Up to $847/Year on Car Insurance in Pennsylvania";
  const subheadline = variant?.subheadline || "Compare quotes from top-rated insurance companies in minutes. No hidden fees, no obligations. Get the coverage you need at a price you'll love.";
  const ctaText = variant?.ctaText || "Get My Free Quote";
  
  const scrollToForm = () => {
    const formElement = document.getElementById("quote-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // FAQ data for schema
  const faqData = {
    questions: [
      {
        question: "How much can I save on car insurance in Pennsylvania?",
        answer: "Pennsylvania drivers can save an average of $400-$850 per year by comparing quotes from multiple insurance providers. Savings vary based on your driving history, coverage needs, and location."
      },
      {
        question: "Is this service really free?",
        answer: "Yes! Our quote comparison service is 100% free with no hidden fees or obligations. We're compensated by insurance providers when we connect them with qualified customers."
      },
      {
        question: "How long does it take to get quotes?",
        answer: "Our form takes just 2 minutes to complete. After submission, you'll typically receive quotes from insurance providers within 24-48 hours via phone or email."
      },
      {
        question: "What information do I need to provide?",
        answer: "You'll need basic information about yourself (age, location), your vehicle (year, make, model), your driving history, and current insurance details."
      },
      {
        question: "Will this affect my credit score?",
        answer: "No, requesting insurance quotes does not affect your credit score. Insurance quote requests are considered soft inquiries."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Schema Markup */}
      <Schema type="organization" data={{}} />
      <Schema type="localBusiness" data={{}} />
      <Schema type="faq" data={faqData} />
      
      {/* Social Proof Notifications */}
      <SocialProofNotification />
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Cheap Car Insurance Pennsylvania</h1>
                <p className="text-xs text-muted-foreground">Your Trusted Insurance Partner</p>
              </div>
            </div>
            <Button onClick={scrollToForm} size="lg" className="hidden md:flex">
              Get Free Quote
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Award className="w-4 h-4" />
                <span className="text-sm font-semibold">Trusted by 50,000+ Pennsylvania Drivers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {headline}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={scrollToForm} size="lg" className="text-lg h-14 px-8">
                  {ctaText}
                </Button>
                <Button onClick={scrollToForm} variant="outline" size="lg" className="text-lg h-14 px-8">
                  See How It Works
                </Button>
              </div>
              <div className="flex items-center space-x-6 mt-8">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4.9/5</span> from 12,847 reviews
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Savings</p>
                        <p className="text-3xl font-bold text-green-600">$847/year</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div>
                        <p className="text-sm text-muted-foreground">Quote Time</p>
                        <p className="text-3xl font-bold text-primary">2 Minutes</p>
                      </div>
                      <Clock className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                      <div>
                        <p className="text-sm text-muted-foreground">Happy Customers</p>
                        <p className="text-3xl font-bold text-purple-600">50,000+</p>
                      </div>
                      <Users className="w-12 h-12 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">A+ BBB Rating</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">No Hidden Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make finding affordable car insurance simple, fast, and completely free.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Save Money</h3>
                <p className="text-muted-foreground">
                  Compare quotes from multiple top-rated insurers and save an average of $847 per year on your car
                  insurance.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Save Time</h3>
                <p className="text-muted-foreground">
                  Get personalized quotes in just 2 minutes. No phone calls, no paperwork, no hassle. It's that simple.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Stay Protected</h3>
                <p className="text-muted-foreground">
                  Your information is secure and private. We work only with licensed, reputable insurance providers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote-form" className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get Your Free Quote Now</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few quick questions and we'll match you with the best insurance rates in Pennsylvania.
            </p>
          </div>
          <MultiStepForm />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting affordable car insurance has never been easier.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Answer Questions</h3>
              <p className="text-muted-foreground">
                Tell us about yourself, your vehicle, and your coverage needs in just 2 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Compare Quotes</h3>
              <p className="text-muted-foreground">
                We'll instantly match you with personalized quotes from top insurance companies.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Save Money</h3>
              <p className="text-muted-foreground">
                Choose the best coverage at the best price and start saving hundreds of dollars per year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <BlogPreview />

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-background" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Is this service really free?</h3>
                <p className="text-muted-foreground">
                  Yes, absolutely! Our service is 100% free with no hidden fees or obligations. We're compensated by
                  insurance companies when you choose a policy, so you never pay a dime.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">How much can I save?</h3>
                <p className="text-muted-foreground">
                  On average, Pennsylvania drivers save $847 per year by comparing quotes. Your actual savings will
                  depend on your specific situation, driving history, and coverage needs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Is my information secure?</h3>
                <p className="text-muted-foreground">
                  Yes. We use bank-level SSL encryption to protect your personal information. We never sell your data
                  and only share it with licensed insurance providers to generate your quotes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Do I have to buy insurance right away?</h3>
                <p className="text-muted-foreground">
                  No. There's no obligation to purchase. You can compare quotes, review your options, and make a
                  decision when you're ready. Take all the time you need.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Save on Car Insurance?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of Pennsylvania drivers who have already saved money with us. Get your free quote in 2
            minutes.
          </p>
          <Button onClick={scrollToForm} size="lg" variant="secondary" className="text-lg h-14 px-8">
            Get Started Now
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
                <span className="font-bold">CheapCarInsurancePA</span>
              </div>
              <p className="text-sm opacity-80">Your trusted partner for affordable car insurance in Pennsylvania.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#quote-form" className="hover:opacity-100">
                    Get Quote
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:opacity-100">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:opacity-100">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="/about" className="hover:opacity-100">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:opacity-100">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:opacity-100">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:opacity-100">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="/privacy" className="hover:opacity-100">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:opacity-100">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2025 CheapCarInsurancePennsylvania.com. All rights reserved.</p>
            <p className="mt-2">
              This site is operated by an independent insurance agency and is not affiliated with any specific insurance
              company.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
