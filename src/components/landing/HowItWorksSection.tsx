import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp } from "lucide-react";

export function HowItWorksSection() {
  return (
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
  );
}
