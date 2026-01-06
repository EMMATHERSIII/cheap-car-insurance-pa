import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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


  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      // Save to Firestore
      await addDoc(collection(db, "leads"), {
        email,
        phone,
        submittedAt: serverTimestamp(),
        type: "express_quote"
      });

      // Also call the tRPC mutation
      submitMutation.mutate({ email, phone });
    } catch (error) {
      console.error("Error submitting express form:", error);
      toast.error("Failed to submit request. Please try again.");
    }
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
