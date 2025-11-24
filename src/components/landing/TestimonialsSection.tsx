import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  return (
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
  );
}
