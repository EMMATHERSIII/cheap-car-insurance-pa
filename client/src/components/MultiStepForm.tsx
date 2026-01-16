import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { trackFormStep, trackFormSubmission, trackFormAbandonment } from "@/components/Analytics";

const US_STATES = [
  { value: "PA", label: "Pennsylvania" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

const INSURANCE_COMPANIES = [
  "State Farm",
  "GEICO",
  "Progressive",
  "Allstate",
  "USAA",
  "Liberty Mutual",
  "Farmers Insurance",
  "Nationwide",
  "Travelers",
  "American Family",
  "Erie Insurance",
  "Auto-Owners Insurance",
  "Country Financial",
  "The Hartford",
  "Esurance",
  "MetLife",
  "Safeco",
  "The General",
  "21st Century",
  "AAA",
  "Amica Mutual",
  "Direct Auto",
  "Elephant",
  "Kemper",
  "Mercury Insurance",
  "Root Insurance",
  "Other",
  "No Current Insurance",
];

const VEHICLE_TYPES = [
  "Sedan",
  "SUV",
  "Truck",
  "Van/Minivan",
  "Coupe",
  "Convertible",
  "Hatchback",
  "Wagon",
  "Sports Car",
  "Luxury Car",
  "Electric Vehicle",
  "Hybrid",
  "Other",
];

const COVERAGE_TYPES = [
  "Liability Only",
  "Collision",
  "Comprehensive",
  "Full Coverage",
  "Minimum State Required",
  "Not Sure",
];

interface FormData {
  age: string;
  state: string;
  zipCode: string;
  vehicleType: string;
  vehicleYear: string;
  hasRecentAccidents: "yes" | "no" | "";
  currentInsurer: string;
  coverageType: string;
  ownershipStatus: "financed" | "owned" | "leased" | "";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: "",
    state: "PA",
    zipCode: "",
    vehicleType: "",
    vehicleYear: "",
    hasRecentAccidents: "",
    currentInsurer: "",
    coverageType: "",
    ownershipStatus: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: (data) => {
      toast.success("Thank you! Your quote request has been submitted.");
      trackFormSubmission(data.leadId);
      setCurrentStep(11); // Success step
    },
    onError: (error) => {
      toast.error("Failed to submit. Please try again.");
      console.error(error);
    },
  });

  // Track form abandonment on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentStep < 11 && currentStep > 0) {
        trackFormAbandonment(currentStep, getStepName(currentStep));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentStep]);

  const getStepName = (step: number): string => {
    const stepNames = [
      "Age",
      "State",
      "ZIP Code",
      "Vehicle Type",
      "Vehicle Year",
      "Recent Accidents",
      "Current Insurer",
      "Coverage Type",
      "Ownership Status",
      "Contact Details",
    ];
    return stepNames[step - 1] || "Unknown";
  };

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      trackFormStep(currentStep, getStepName(currentStep));
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        const age = parseInt(formData.age);
        if (!formData.age || age < 16 || age > 100) {
          toast.error("Please enter a valid age (16-100)");
          return false;
        }
        return true;
      case 2:
        if (!formData.state) {
          toast.error("Please select your state");
          return false;
        }
        return true;
      case 3:
        if (!formData.zipCode || formData.zipCode.length < 5) {
          toast.error("Please enter a valid ZIP code");
          return false;
        }
        return true;
      case 4:
        if (!formData.vehicleType) {
          toast.error("Please select your vehicle type");
          return false;
        }
        return true;
      case 5:
        const year = parseInt(formData.vehicleYear);
        if (!formData.vehicleYear || year < 1900 || year > new Date().getFullYear() + 1) {
          toast.error("Please enter a valid vehicle year");
          return false;
        }
        return true;
      case 6:
        if (!formData.hasRecentAccidents) {
          toast.error("Please select an option");
          return false;
        }
        return true;
      case 7:
        if (!formData.currentInsurer) {
          toast.error("Please select your current insurance company");
          return false;
        }
        return true;
      case 8:
        if (!formData.coverageType) {
          toast.error("Please select your coverage type");
          return false;
        }
        return true;
      case 9:
        if (!formData.ownershipStatus) {
          toast.error("Please select your ownership status");
          return false;
        }
        return true;
      case 10:
        if (!formData.firstName || !formData.lastName) {
          toast.error("Please enter your full name");
          return false;
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        if (!formData.phone || formData.phone.length < 10) {
          toast.error("Please enter a valid phone number");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;

    // Get UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);

    submitLead.mutate({
      age: parseInt(formData.age),
      state: formData.state,
      zipCode: formData.zipCode,
      vehicleType: formData.vehicleType,
      vehicleYear: parseInt(formData.vehicleYear),
      hasRecentAccidents: formData.hasRecentAccidents as "yes" | "no",
      currentInsurer: formData.currentInsurer,
      coverageType: formData.coverageType,
      ownershipStatus: formData.ownershipStatus as "financed" | "owned" | "leased",
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      utmSource: urlParams.get("utm_source") || undefined,
      utmMedium: urlParams.get("utm_medium") || undefined,
      utmCampaign: urlParams.get("utm_campaign") || undefined,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What is your age?</h2>
              <p className="text-muted-foreground">This helps us find the best rates for you</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="16"
                max="100"
                value={formData.age}
                onChange={(e) => updateFormData("age", e.target.value)}
                placeholder="Enter your age"
                className="text-lg h-12"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Which state do you live in?</h2>
              <p className="text-muted-foreground">Insurance rates vary by state</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                <SelectTrigger className="text-lg h-12">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What is your ZIP code?</h2>
              <p className="text-muted-foreground">We'll find local insurance providers</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => updateFormData("zipCode", e.target.value)}
                placeholder="Enter your ZIP code"
                className="text-lg h-12"
                maxLength={10}
                autoFocus
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What type of vehicle do you drive?</h2>
              <p className="text-muted-foreground">Different vehicles have different insurance needs</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => updateFormData("vehicleType", value)}>
                <SelectTrigger className="text-lg h-12">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What year is your vehicle?</h2>
              <p className="text-muted-foreground">Newer vehicles may qualify for discounts</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Vehicle Year</Label>
              <Input
                id="vehicleYear"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.vehicleYear}
                onChange={(e) => updateFormData("vehicleYear", e.target.value)}
                placeholder="e.g., 2020"
                className="text-lg h-12"
                autoFocus
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Any accidents in the last 3 months?</h2>
              <p className="text-muted-foreground">This affects your insurance rates</p>
            </div>
            <RadioGroup
              value={formData.hasRecentAccidents}
              onValueChange={(value) => updateFormData("hasRecentAccidents", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="no" id="no-accidents" />
                <Label htmlFor="no-accidents" className="flex-1 cursor-pointer text-lg">
                  No accidents
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="yes" id="yes-accidents" />
                <Label htmlFor="yes-accidents" className="flex-1 cursor-pointer text-lg">
                  Yes, I had an accident
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Who is your current insurance company?</h2>
              <p className="text-muted-foreground">We'll help you compare and save</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentInsurer">Current Insurance Company</Label>
              <Select value={formData.currentInsurer} onValueChange={(value) => updateFormData("currentInsurer", value)}>
                <SelectTrigger className="text-lg h-12">
                  <SelectValue placeholder="Select your insurer" />
                </SelectTrigger>
                <SelectContent>
                  {INSURANCE_COMPANIES.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What type of coverage do you have?</h2>
              <p className="text-muted-foreground">Understanding your current coverage helps us find better options</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverageType">Coverage Type</Label>
              <Select value={formData.coverageType} onValueChange={(value) => updateFormData("coverageType", value)}>
                <SelectTrigger className="text-lg h-12">
                  <SelectValue placeholder="Select coverage type" />
                </SelectTrigger>
                <SelectContent>
                  {COVERAGE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Do you own, finance, or lease your vehicle?</h2>
              <p className="text-muted-foreground">This affects your coverage requirements</p>
            </div>
            <RadioGroup
              value={formData.ownershipStatus}
              onValueChange={(value) => updateFormData("ownershipStatus", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="owned" id="owned" />
                <Label htmlFor="owned" className="flex-1 cursor-pointer text-lg">
                  I own my vehicle
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="financed" id="financed" />
                <Label htmlFor="financed" className="flex-1 cursor-pointer text-lg">
                  I'm financing my vehicle
                </Label>
              </div>
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="leased" id="leased" />
                <Label htmlFor="leased" className="flex-1 cursor-pointer text-lg">
                  I'm leasing my vehicle
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Almost done! Enter your contact details</h2>
              <p className="text-muted-foreground">We'll send your personalized quotes here</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="John"
                  className="h-12"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Doe"
                  className="h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="john@example.com"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className="h-12"
              />
            </div>
          </div>
        );

      case 11:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-lg text-muted-foreground mb-2">Your quote request has been submitted successfully.</p>
            <p className="text-muted-foreground">We'll contact you shortly with personalized insurance quotes.</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (currentStep === 11) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {renderStep()}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="min-h-[300px]">{renderStep()}</div>

      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="h-12 px-6">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={nextStep} className="h-12 px-6">
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitLead.isPending} className="h-12 px-6">
            {submitLead.isPending ? "Submitting..." : "Get My Quotes"}
          </Button>
        )}
      </div>
    </div>
  );
}
