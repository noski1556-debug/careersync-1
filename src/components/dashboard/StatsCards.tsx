import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useQuery } from "convex/react";
import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;

interface StatsCardsProps {
  analysesCount: number;
  isPro: boolean;
}

export function StatsCards({ analysesCount, isPro }: StatsCardsProps) {
  const interviewCount = useQuery(api.interviews.getInterviewCount) || 0;
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={item} className="md:col-span-2">
       <Card className="h-full bg-black/20 backdrop-blur-md border border-white/10 shadow-none">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Career Stats
              </CardTitle>
              <CardDescription className="text-foreground/60">Your progress at a glance</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-bold text-primary">{analysesCount}</div>
                  <div className="text-xs text-foreground/70 font-medium uppercase tracking-wider mt-1">Total Analyses</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-bold text-primary">{isPro ? "PRO" : "FREE"}</div>
                  <div className="text-xs text-foreground/70 font-medium uppercase tracking-wider mt-1">Current Plan</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-bold text-primary">{interviewCount}</div>
                  <div className="text-xs text-foreground/70 font-medium uppercase tracking-wider mt-1">Interviews</div>
              </div>
          </CardContent>
       </Card>
    </motion.div>
  );
}
