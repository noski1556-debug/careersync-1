import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export function CTASection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
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
  );
}
