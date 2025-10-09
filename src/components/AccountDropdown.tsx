import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { User, Copy, Gift, Crown, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function AccountDropdown() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const referralStats = useQuery(api.referrals.getUserReferralStats);
  const isPro = useQuery(api.careersync.checkProStatus);

  if (!isAuthenticated) {
    return null;
  }

  const handleCopyReferralCode = () => {
    if (referralStats?.referralCode) {
      navigator.clipboard.writeText(referralStats.referralCode);
      toast.success("Referral code copied to clipboard!");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 font-semibold">
          {getUserInitials()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            {isPro && (
              <div className="flex items-center gap-1 mt-1">
                <Crown className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-semibold">Pro Member</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {referralStats?.referralCode && (
          <>
            <div className="px-2 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  Your Referral Code
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-bold bg-muted px-2 py-1 rounded">
                  {referralStats.referralCode}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopyReferralCode}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {referralStats.credits}/3 referrals • {referralStats.totalValidReferrals} total
              </p>
              {referralStats.activeRewards && referralStats.activeRewards.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {referralStats.activeRewards.map((reward, idx) => (
                    <span key={idx} className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      {reward.rewardType === "discount" 
                        ? `${reward.discountPercentage}% off` 
                        : `${reward.durationMonths}mo free`}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer">
          <Home className="mr-2 h-4 w-4" />
          Home
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        
        {!isPro && (
          <DropdownMenuItem onClick={() => navigate("/pricing")} className="cursor-pointer">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}