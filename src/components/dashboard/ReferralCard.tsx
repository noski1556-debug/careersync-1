import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Copy, Gift } from "lucide-react";
import { toast } from "sonner";

interface ReferralCardProps {
  referralStats: any;
}

export function ReferralCard({ referralStats }: ReferralCardProps) {
  const handleCopyReferralCode = () => {
    if (referralStats?.referralCode) {
      navigator.clipboard.writeText(referralStats.referralCode);
      toast.success("Referral code copied to clipboard!");
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!referralStats?.referralCode) return null;

  return (
    <motion.div variants={item} className="md:col-span-2">
        <Card className="h-full border border-white/10 bg-black/20 backdrop-blur-md shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Gift className="h-32 w-32" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Gift className="h-5 w-5 text-primary" />
              Referral Rewards
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Share your journey and earn Pro access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <code className="text-3xl font-bold bg-black/30 px-4 py-2 rounded-lg border border-white/10 tracking-wider text-zinc-100">
                    {referralStats.referralCode}
                  </code>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyReferralCode}
                      className="hover:bg-white/10 text-zinc-400 hover:text-primary"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-zinc-400">
                    <span>Progress to 3 Months Free Pro</span>
                    <span>{referralStats.credits}/3 Friends</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(referralStats.credits / 3) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-px h-24 bg-white/10" />
              <div className="text-center md:text-right">
                <div className="text-4xl font-bold text-zinc-100">{referralStats.totalValidReferrals}</div>
                <div className="text-sm text-zinc-500">Total Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>
    </motion.div>
  );
}
