import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router";

export function PricingPreviewSection() {
  const navigate = useNavigate();

  return (
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
  );
}
