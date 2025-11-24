import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function FeaturesSection() {
  return (
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
  );
}
