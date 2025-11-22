import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Briefcase, CheckCircle, Crown, GraduationCap, Loader2, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router";
import { useRef } from "react";
import { AccountDropdown } from "@/components/AccountDropdown";
import { AIMentorChat } from "@/components/AIMentorChat";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  // CTA button glow on scroll
  const ctaGlow = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 1, 0]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="https://harmless-tapir-303.convex.cloud/api/storage/a13341f4-8185-4c3d-8e53-9217387b808c" alt="Evoluskill" className="h-16 w-auto" />
              <div className="flex items-center gap-2 mb-4">
                <img src="https://harmless-tapir-303.convex.cloud/api/storage/a13341f4-8185-4c3d-8e53-9217387b808c" alt="Evoluskill" className="h-8 w-auto" />
              </div>
=======
              <div className="flex items-center gap-2 mb-4">
                <img src="https://harmless-tapir-303.convex.cloud/api/storage/a13341f4-8185-4c3d-8e53-9217387b808c" alt="Evoluskill" className="h-8 w-auto" />
              </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" onClick={() => navigate("/pricing")}>
                Pricing
              </Button>
            </motion.div>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </Button>
                </motion.div>
                <AccountDropdown />
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 -z-10" />
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          style={{ opacity, scale }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 backdrop-blur-sm text-primary px-6 py-3 rounded-full text-sm font-semibold mb-8 border-2 border-primary/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(var(--primary), 0.4)" }}
          >
            <Sparkles className="h-5 w-5" />
            Your AI Career Coach
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent drop-shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Stop guessing your next move — your AI coach already mapped it.
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            60 seconds. One upload. Your personalized 3-week roadmap to the career you actually want.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              style={{
                boxShadow: useTransform(
                  ctaGlow,
                  [0, 1],
                  ["0 10px 40px rgba(0, 207, 193, 0.3)", "0 10px 60px rgba(0, 207, 193, 0.6)"]
                )
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={handleGetStarted} 
                className="gap-2 text-lg px-8 bg-[#00CFC1] hover:bg-[#00B8AA] text-white shadow-lg relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="relative z-10">Get my free roadmap</span>
                <ArrowRight className="h-5 w-5 relative z-10" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }} className="text-lg px-8">
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Sample Roadmap Snippet */}
          <motion.div 
            className="mt-8 max-w-md mx-auto bg-card/80 backdrop-blur-sm border rounded-lg p-4 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <p className="text-xs text-muted-foreground mb-3 text-center font-semibold">What you'll get:</p>
            <ul className="space-y-2 text-sm">
              {[
                { week: 1, text: "Master Python fundamentals (5 hours, free course)" },
                { week: 2, text: "Learn SQL & databases (8 hours, free course)" },
                { week: 3, text: "Build your first data project (10 hours)" }
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <CheckCircle className="h-4 w-4 text-[#00CFC1] flex-shrink-0 mt-0.5" />
                  <span><strong>Week {item.week}:</strong> {item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.p 
            className="text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            ✓ Free forever plan • ✓ No credit card required • ✓ 2 minutes to insights
          </motion.p>

          {/* Trust Badges */}
          <motion.div 
            className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <span className="flex items-center gap-1">🔒 GDPR</span>
            <span>•</span>
            <span className="flex items-center gap-1">🔐 AES-256 encrypted</span>
            <span>•</span>
            <span className="flex items-center gap-1">🚫 No sharing</span>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <p className="text-lg font-semibold text-primary">
              ✅ Used by 10,000+ professionals worldwide
            </p>
          </motion.div>

          {/* Trusted Partners */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-xs text-muted-foreground text-center mb-4">
              Data insights from leading platforms
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap opacity-60 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="h-8" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Coursera_logo.png" alt="Coursera" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Udemy_logo.png" alt="Udemy" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Codecademy_logo.png" alt="Codecademy" className="h-6" />
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Dashboard Preview - Enhanced with fade-in animation */}
        <motion.div
          className="max-w-5xl mx-auto mt-20"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="relative rounded-xl overflow-hidden border-2 border-primary/20 shadow-2xl"
            whileHover={{ scale: 1.02, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
            <div className="bg-card p-6">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div>
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted/50 rounded mt-1 animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-primary/20 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-accent/20 rounded animate-pulse" />
                </div>
              </div>

              {/* Mock CV Score Card */}
              <motion.div 
                className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 mb-4 border border-primary/20"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <motion.div 
                      className="text-6xl font-bold text-primary"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      87
                    </motion.div>
                    <div className="text-xs text-muted-foreground mt-1">CV Score</div>
                  </div>
                  <div className="h-16 w-px bg-border" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">⭐ Excellent - Strong Candidate</h3>
                    <p className="text-sm text-muted-foreground">Top 15% of candidates in your field</p>
                  </div>
                </div>
              </motion.div>

              {/* Mock Skills Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div 
                  className="bg-muted/30 rounded-lg p-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Your Top Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "React", "SQL", "AWS"].map((skill, idx) => (
                      <motion.div
                        key={idx}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8 + idx * 0.1 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--primary), 0.3)" }}
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-muted/30 rounded-lg p-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-accent" />
                    Next to Learn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Docker", "TypeScript", "GraphQL"].map((skill, idx) => (
                      <motion.div
                        key={idx}
                        className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.0 + idx * 0.1 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--accent), 0.3)" }}
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          <motion.p 
            className="text-center text-sm text-muted-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            ↑ This is what you'll see in 60 seconds
          </motion.p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              From stuck to unstoppable in 5 steps
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              No fluff. No guesswork. Just your next move, mapped out.
            </motion.p>
          </div>

          {/* 5-Step Visual Workflow */}
          <div className="mb-16 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {[
              { step: "1", title: "Upload CV", icon: "📄", free: true },
              { step: "2", title: "AI analyzes skills", icon: "🤖", free: true },
              { step: "3", title: "3-week roadmap", icon: "🗺️", free: true, badge: "FREE" },
              { step: "4", title: "Job matches", icon: "💼", free: true },
              { step: "5", title: "Salary forecast", icon: "💰", free: false, badge: "PRO" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center">
                <motion.div 
                  className={`flex flex-col items-center ${!item.free ? 'opacity-60' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: item.free ? 1 : 0.6, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <div className={`w-16 h-16 rounded-full ${item.free ? 'bg-primary/20 border-2 border-primary' : 'bg-muted border-2 border-muted-foreground/30'} flex items-center justify-center text-2xl mb-2 relative`}>
                    {item.icon}
                    {item.badge && (
                      <span className={`absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.free ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-center max-w-[80px]">{item.title}</span>
                </motion.div>
                {idx < 4 && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Drop your CV, we'll do the rest",
                description: "PDF or DOCX. Our AI reads between the lines — extracting skills you forgot you had.",
              },
              {
                icon: <GraduationCap className="h-8 w-8" />,
                title: "AI maps your gaps (brutally honest)",
                description: "No sugar-coating. See exactly what's holding you back and the fastest path forward.",
              },
              {
                icon: <Briefcase className="h-8 w-8" />,
                title: "Get jobs you can actually land",
                description: "Real companies. Real roles. Matched to your skills + location. No fantasy listings.",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <Card className="h-full backdrop-blur-sm bg-card/80 border-2 hover:border-primary/50 transition-all">
                  <CardContent className="pt-6">
                    <motion.div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-4 shadow-lg border-2 border-primary/30"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Free vs Pro Comparison */}
      <section className="container mx-auto px-4 py-20 bg-muted/20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Free vs Pro
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                <div className="p-6 bg-muted/50 font-semibold">Feature</div>
                <div className="p-6 bg-muted/50 font-semibold text-center">Free</div>
                <div className="p-6 bg-primary/10 font-semibold text-center">Pro</div>

                <div className="p-4">CV Scans</div>
                <div className="p-4 text-center text-muted-foreground">1 scan</div>
                <div className="p-4 text-center font-semibold">Unlimited</div>

                <div className="p-4">Learning Roadmap</div>
                <div className="p-4 text-center text-muted-foreground">3 weeks</div>
                <div className="p-4 text-center font-semibold">6 weeks</div>

                <div className="p-4">Job Matches</div>
                <div className="p-4 text-center text-muted-foreground">1 match</div>
                <div className="p-4 text-center font-semibold">8-12 matches</div>

                <div className="p-4">Salary Forecast</div>
                <div className="p-4 text-center text-muted-foreground">—</div>
                <div className="p-4 text-center font-semibold">✓</div>

                <div className="p-4">CV Improvement</div>
                <div className="p-4 text-center text-muted-foreground">—</div>
                <div className="p-4 text-center font-semibold">✓</div>

                <div className="p-4 font-semibold">Price</div>
                <div className="p-4 text-center font-semibold text-green-600">Free forever</div>
                <div className="p-4 text-center">
                  <div className="font-semibold text-green-600 text-lg">FREE</div>
                  <div className="text-xs font-semibold text-destructive">⏰ Limited Time Only</div>
                  <div className="text-xs text-muted-foreground line-through">€9/month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button size="lg" onClick={() => navigate("/pricing")} className="gap-2 bg-green-600 hover:bg-green-700">
              <Crown className="h-5 w-5" />
              Get Pro FREE Now
            </Button>
            <p className="text-sm font-semibold text-destructive mt-2">
              ⏰ Limited time offer — claim before it's gone!
            </p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-muted-foreground">
              Powered by advanced AI to give you actionable career insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "AI-powered skill gap analysis",
              "Personalized 6-week learning roadmaps",
              "Job matches based on your profile",
              "Salary forecasts and market insights",
              "Course recommendations from top platforms",
              "Track your progress over time",
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Trusted by Career Builders
            </h2>
            <p className="text-muted-foreground">Real results from real users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Got an interview in 3 weeks after following the roadmap. The AI knew exactly what I needed to learn.",
                author: "Sarah Chen",
                role: "Software Engineer",
                initials: "SC",
                rating: 5,
              },
              {
                quote: "The learning roadmap was spot-on. I followed it and doubled my salary in 6 months.",
                author: "Marcus Johnson",
                role: "Data Analyst",
                initials: "MJ",
                rating: 5,
              },
              {
                quote: "Beta user here — Career Compass helped me identify my skill gaps and land my dream role at a tech startup.",
                author: "Elena Rodriguez",
                role: "Product Manager",
                initials: "ER",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500">⭐</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="border-2 border-primary shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
            <CardContent className="pt-12 pb-12">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-16 w-16 mx-auto mb-6 text-primary drop-shadow-lg" />
              </motion.div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of professionals who've unlocked their potential with Evoluskill
              </p>
              <Button size="lg" onClick={handleGetStarted} className="gap-2 text-lg px-8">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                🔒 Privacy-first • GDPR-safe • Data encrypted
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://harmless-tapir-303.convex.cloud/api/storage/89ddb60d-5ce3-4819-b55c-5df04ca68217" alt="Evoluskill" className="h-8 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered career development assistant. Transform your career in 60 seconds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📍 HQ: Dublin, Ireland</li>
                <li>🔐 Data secured with AES-256 encryption</li>
                <li>🛡️ GDPR compliant</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate("/pricing")} className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-primary transition-colors">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/career-intelligence")} className="text-muted-foreground hover:text-primary transition-colors">
                    Career Intelligence
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t pt-8">
            <p>© 2025 Evoluskill. Built with ❤️ to help you grow.</p>
          </div>
        </div>
      </footer>

      {/* AI Mentor Chat - Floating Component */}
      <AIMentorChat />
    </div>
  );
}