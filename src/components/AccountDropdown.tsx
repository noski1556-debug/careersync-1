import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import type { FunctionReference } from "convex/server";

import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;

import { User, Copy, Gift, Crown, LogOut, Home, Edit } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function AccountDropdown() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const referralStats = useQuery(api.referrals.getUserReferralStats as FunctionReference<"query">);
  const isPro = useQuery(api.careersync.checkProStatus as FunctionReference<"query">);

  const ensureReferralCode = useMutation(api.referrals.ensureReferralCode);
  const updateUserName = useMutation(api.users.updateUserName);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Ensure referral code exists for the user
  useEffect(() => {
    if (isAuthenticated && referralStats !== undefined && !referralStats?.referralCode) {
      ensureReferralCode().catch(console.error);
    }
  }, [isAuthenticated, referralStats, ensureReferralCode]);

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

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    // Validation
    if (newName.length < 2 || newName.length > 50) {
      toast.error("Name must be between 2 and 50 characters");
      return;
    }

    if (!/^[a-zA-Z\s'-]+$/.test(newName)) {
      toast.error("Name can only contain letters, spaces, hyphens, and apostrophes");
      return;
    }

    if (newName.trim() !== newName || /^\s+$/.test(newName)) {
      toast.error("Name cannot be only whitespace");
      return;
    }

    setIsUpdating(true);
    try {
      await updateUserName({ name: newName.trim() });
      toast.success("Name updated successfully!");
      setIsEditingName(false);
      setNewName("");
    } catch (error) {
      console.error("Update name error:", error);
      toast.error("Failed to update name");
    } finally {
      setIsUpdating(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n: string) => n[0])
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full w-10 h-10 font-semibold">
            {getUserInitials()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setNewName(user?.name || "");
                    setIsEditingName(true);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
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
          
          {referralStats?.referralCode ? (
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
                    {referralStats.activeRewards.map((reward: any, idx: number) => (
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
          ) : (
            <>
              <div className="px-2 py-2">
                <p className="text-xs text-muted-foreground">
                  Loading referral code...
                </p>
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

      <Dialog open={isEditingName} onOpenChange={setIsEditingName}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Name</DialogTitle>
            <DialogDescription>
              Update your display name. This will be visible across your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                2-50 characters, letters, spaces, hyphens, and apostrophes only
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingName(false);
                setNewName("");
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateName} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}