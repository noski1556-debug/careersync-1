import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import type { FunctionReference } from "convex/server";

import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;

import { motion } from "framer-motion";
import { Crown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AccountDropdown } from "@/components/AccountDropdown";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { UploadCard } from "@/components/dashboard/UploadCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ReferralCard } from "@/components/dashboard/ReferralCard";
import { RecentAnalyses } from "@/components/dashboard/RecentAnalyses";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const analyses = useQuery(api.careersync.getUserAnalyses as FunctionReference<"query">);
  const isPro = useQuery(api.careersync.checkProStatus as FunctionReference<"query">);
  const referralStats = useQuery(api.referrals.getUserReferralStats as FunctionReference<"query">);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="cursor-pointer" 
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logo />
          </motion.div>
          <div className="flex items-center gap-4">
            {!isPro && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={() => navigate("/pricing")} className="gap-2 hidden sm:flex bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200 backdrop-blur-sm">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Upgrade to Pro
                </Button>
              </motion.div>
            )}
            <ThemeToggle />
            <AccountDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <WelcomeSection userName={user?.name} />

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <UploadCard 
              isPro={!!isPro} 
              analysesCount={analyses?.length || 0} 
              user={user} 
            />

            <StatsCards 
              analysesCount={analyses?.length || 0} 
              isPro={!!isPro} 
            />

            <ReferralCard referralStats={referralStats} />

            <RecentAnalyses 
              analyses={analyses || []} 
              hasReferralCode={!!referralStats?.referralCode} 
            />

          </div>
        </motion.div>
      </div>
    </div>
  );
}