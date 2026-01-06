import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;
import { useAction } from "convex/react";
import type { FunctionReference } from "convex/server";
import { motion } from "framer-motion";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { AccountDropdown } from "@/components/AccountDropdown";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Pricing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const createCheckout = useAction(api.autumn.createCheckoutSession as FunctionReference<"action">);

  const handleSelectPlan = async (plan: "free" | "pro") => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (plan === "free") {
      navigate("/dashboard");
      return;
    }

    // For Pro plan, create Stripe checkout
    setProcessingCheckout(true);
    try {
      const result = await createCheckout({
        priceId: "price_pro_monthly", // Replace with your actual Stripe price ID
        successUrl: `${window.location.origin}/dashboard?checkout=success`,
        cancelUrl: `${window.location.origin}/pricing?checkout=canceled`,
      });
      
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please ensure Autumn is configured with your API key.");
      setProcessingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <ThemeToggle />
                <AccountDropdown />
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you're ready to unlock your full potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle>Evoluskill Free</CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">€0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>
                    Perfect for getting started with AI career insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {[
                      "1 CV scan per month",
                      "Basic skill analysis",
                      "Limited learning roadmap (50%)",
                      "1 job match",
                      "Email support",
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleSelectPlan("free")}
                  >
                    Get Started Free
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full border-2 border-primary relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <CardTitle>Evoluskill Pro</CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">€9</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>
                    Unlock your full career potential with unlimited access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {[
                      "Unlimited CV scans",
                      "Full AI skill analysis",
                      "Complete 6-week learning roadmap",
                      "5+ personalized job matches",
                      "Salary forecasts & market insights",
                      "Skill trend predictions",
                      "Priority email support",
                      "Early access to new features",
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSelectPlan("pro")}
                    disabled={processingCheckout}
                  >
                    {processingCheckout ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Start 7-Day Free Trial"
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Cancel anytime • No commitment
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "Can I cancel anytime?",
                  a: "Yes! Cancel your Pro subscription anytime with no penalties. You'll keep access until the end of your billing period.",
                },
                {
                  q: "Is my data secure?",
                  a: "Absolutely. We use bank-level encryption and are fully GDPR compliant. Your CV data is never shared with third parties.",
                },
                {
                  q: "How accurate is the AI analysis?",
                  a: "Our AI is trained on millions of job postings and CVs. It provides 90%+ accurate skill assessments and career recommendations.",
                },
              ].map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}