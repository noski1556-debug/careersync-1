import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
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
  );
}