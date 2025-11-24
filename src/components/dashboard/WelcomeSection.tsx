import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeSectionProps {
  userName?: string;
}

export function WelcomeSection({ userName }: WelcomeSectionProps) {
  const navigate = useNavigate();
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-end gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-zinc-100">
          Welcome back, {userName?.split(' ')[0] || "Friend"}!
        </h1>
        <p className="text-zinc-400 text-lg font-light">
          Your career evolution continues today.
        </p>
      </div>
      <div className="flex gap-2">
         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
           <Button 
              variant="outline"
              onClick={() => navigate("/career-intelligence")}
              className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm text-zinc-200"
            >
              <TrendingUp className="h-4 w-4" />
              Career Intelligence
            </Button>
         </motion.div>
      </div>
    </motion.div>
  );
}