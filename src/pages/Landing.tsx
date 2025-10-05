import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, CheckCircle, GraduationCap, Loader2, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-2" onClick={() => navigate("/")}>
=======
            <img src="/logo.svg" alt="CareerSync" className="h-8 w-8" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CareerSync</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/pricing")}>
              Pricing
            </Button>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative"
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 backdrop-blur-sm text-primary px-6 py-3 rounded-full text-sm font-semibold mb-8 border-2 border-primary/30 shadow-lg"
            animate={{ 
              boxShadow: ["0 0 20px rgba(var(--primary), 0.3)", "0 0 40px rgba(var(--primary), 0.5)", "0 0 20px rgba(var(--primary), 0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5" />
            AI-Powered Career Intelligence
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
            Unlock Your Career Potential with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            CareerSync analyzes your CV and builds your personalized roadmap to better skills, better jobs, and better pay.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="gap-2 text-lg px-8">
              Get My Free Roadmap
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }} className="text-lg px-8">
              See How It Works
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            ✓ Free forever plan • ✓ No credit card required • ✓ 2 minutes to insights
          </p>
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
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Your Career Growth in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground">
              From CV upload to personalized roadmap in under 2 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Upload Your CV",
                description: "Drop your CV or connect LinkedIn. Our AI instantly extracts your skills and experience.",
              },
              {
                icon: <GraduationCap className="h-8 w-8" />,
                title: "AI Analysis",
                description: "Get insights on your strengths, missing skills, and a personalized 6-week learning roadmap.",
              },
              {
                icon: <Briefcase className="h-8 w-8" />,
                title: "Unlock Opportunities",
                description: "Discover job matches, salary forecasts, and courses to level up your career.",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full backdrop-blur-sm bg-card/80">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-4 shadow-lg border-2 border-primary/30">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "CareerSync showed me exactly what I was missing to land my dream job. Within 3 months, I got promoted!",
                author: "Sarah Chen",
                role: "Software Engineer",
              },
              {
                quote: "The learning roadmap was spot-on. I followed it and doubled my salary in 6 months.",
                author: "Marcus Johnson",
                role: "Data Analyst",
              },
              {
                quote: "Finally, a tool that understands my career goals. The AI insights are incredibly accurate.",
                author: "Elena Rodriguez",
                role: "Product Manager",
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
                    <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
                Join thousands of professionals who've unlocked their potential with CareerSync
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
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 CareerSync. Built with ❤️ to help you grow.</p>
        </div>
      </footer>
    </div>
  );
}