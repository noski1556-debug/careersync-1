import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useAction, useMutation, useQuery } from "convex/react";
import type { FunctionReference } from "convex/server";

import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;

import { motion } from "framer-motion";
import { ArrowRight, FileText, Loader2, Upload, Sparkles, Crown, Copy, Gift, TrendingUp, Mountain } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import { AccountDropdown } from "@/components/AccountDropdown";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  const analyses = useQuery(api.careersync.getUserAnalyses as FunctionReference<"query">);
  const isPro = useQuery(api.careersync.checkProStatus as FunctionReference<"query">);
  const referralStats = useQuery(api.referrals.getUserReferralStats as FunctionReference<"query">);
  const createAnalysis = useMutation(api.careersync.createCVAnalysis as FunctionReference<"mutation">);
  const analyzeCV = useAction(api.aiAnalysis.analyzeCV as FunctionReference<"action">);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl as FunctionReference<"mutation">);
  const checkRateLimit = useMutation(api.careersync.checkRateLimit as FunctionReference<"mutation">);

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

  const handleCopyReferralCode = () => {
    if (referralStats?.referralCode) {
      navigator.clipboard.writeText(referralStats.referralCode);
      toast.success("Referral code copied to clipboard!");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }

    setUploading(true);
    toast.info("Checking rate limit...");

    try {
      // Simple IP detection (in production, use proper IP extraction from headers)
      const ipAddress = "user-ip-placeholder"; // In production, get from request headers
      
      const rateLimitCheck = await checkRateLimit({ ipAddress });
      
      if (!rateLimitCheck.allowed) {
        toast.error(`Please wait ${rateLimitCheck.secondsRemaining} seconds before uploading another CV`);
        setUploading(false);
        return;
      }

      toast.info("Uploading your CV...");

      // Get upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }
      
      const { storageId } = await result.json();

      // For demo purposes, extract basic text (in production, use proper PDF parsing)
      const extractedText = `CV for ${user?.name || user?.email || 'Test User'} - ${file.name}`;
      
      // Generate content hash for caching using Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(extractedText);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Ask for user location
      const userLocation = prompt("Where are you located? (City, Country)\nThis helps us provide personalized job recommendations near you:");

      // Create analysis record
      const result2 = await createAnalysis({
        fileName: file.name,
        fileStorageId: storageId,
        extractedText,
        userLocation: userLocation || undefined,
        contentHash,
      });

      if (result2.cached) {
        toast.success("Found cached analysis! Loading results instantly...");
        navigate(`/analysis/${result2.analysisId}`);
        return;
      }

      toast.success("CV uploaded! Analyzing...");

      // Trigger AI analysis (don't await - let it run in background)
      analyzeCV({
        analysisId: result2.analysisId,
        extractedText,
        userLocation: userLocation || undefined,
      }).catch((error) => {
        console.error("Analysis error:", error);
        toast.error("Analysis failed. Please try again.");
      });

      // Navigate immediately to show progress
      navigate(`/analysis/${result2.analysisId}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload CV. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            {!isPro && (
              <Button variant="outline" onClick={() => navigate("/pricing")} className="gap-2 hidden sm:flex bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200 backdrop-blur-sm">
                <Crown className="h-4 w-4 text-yellow-500" />
                Upgrade to Pro
              </Button>
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
          {/* Welcome Section */}
          <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-zinc-100">
                Welcome back, {user?.name?.split(' ')[0] || "Friend"}!
              </h1>
              <p className="text-zinc-400 text-lg font-light">
                Your career evolution continues today.
              </p>
            </div>
            <div className="flex gap-2">
               <Button 
                  variant="outline"
                  onClick={() => navigate("/career-intelligence")}
                  className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm text-zinc-200"
                >
                  <TrendingUp className="h-4 w-4" />
                  Career Intelligence
                </Button>
            </div>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Col 1: Upload CV (Row Span 2) */}
            <motion.div variants={item} className="md:col-span-1 md:row-span-2 h-full">
              <Card className="h-full border border-white/10 border-dashed bg-black/20 backdrop-blur-md hover:border-primary/50 transition-all duration-300 group relative overflow-hidden shadow-none hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-zinc-100">
                    <Upload className="h-6 w-6 text-primary" />
                    New Analysis
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Upload your latest CV to track your progress.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[300px] relative z-10">
                  <input
                    type="file"
                    id="cv-upload"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <label htmlFor="cv-upload" className="w-full h-full flex items-center justify-center cursor-pointer">
                    <div className="flex flex-col items-center gap-4 p-6 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                      {uploading ? (
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      ) : (
                        <Sparkles className="h-12 w-12 text-primary" />
                      )}
                      <span className="font-semibold text-primary">
                        {uploading ? "Analyzing..." : "Click to Upload CV"}
                      </span>
                    </div>
                  </label>
                  <p className="text-xs text-zinc-500 mt-6 text-center">
                    Supports PDF & DOCX • {isPro ? "Unlimited Pro Scans" : `${analyses?.length || 0}/1 Free Scan`}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Col 2 & 3: Stats Overview (Always visible) */}
            <motion.div variants={item} className="md:col-span-2">
               <Card className="h-full bg-black/20 backdrop-blur-md border border-white/10 shadow-none">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-zinc-100">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Career Stats
                      </CardTitle>
                      <CardDescription className="text-zinc-400">Your progress at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="text-3xl font-bold text-primary">{analyses?.length || 0}</div>
                          <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Total Analyses</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="text-3xl font-bold text-primary">{isPro ? "PRO" : "FREE"}</div>
                          <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Current Plan</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="text-3xl font-bold text-primary">0</div>
                          <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Interviews</div>
                      </div>
                  </CardContent>
               </Card>
            </motion.div>

            {/* Col 2 & 3: Referral (if exists) */}
            {referralStats?.referralCode && (
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
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopyReferralCode}
                                className="hover:bg-white/10 text-zinc-400 hover:text-primary"
                              >
                                <Copy className="h-5 w-5" />
                              </Button>
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
            )}

            {/* Recent Analyses */}
            <motion.div variants={item} className={referralStats?.referralCode ? "md:col-span-3" : "md:col-span-2"}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Recent Analyses</h2>
              </div>
              
              {!analyses || analyses.length === 0 ? (
                <Card className="bg-black/20 backdrop-blur-md border border-dashed border-white/10 shadow-none">
                  <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Mountain className="h-24 w-24 text-zinc-800 mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-zinc-200">Your journey starts here</h3>
                    <p className="text-zinc-500 max-w-sm mt-2">
                      Upload your first CV to unlock AI-powered insights and a personalized roadmap.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {analyses.map((analysis: any, idx: number) => (
                    <motion.div
                      key={analysis._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="h-full"
                    >
                      <Card 
                        className="cursor-pointer h-full bg-black/20 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 group"
                        onClick={() => navigate(`/analysis/${analysis._id}`)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <FileText className="h-5 w-5" />
                            </div>
                            {analysis.cvRating && (
                                <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    analysis.cvRating >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                    analysis.cvRating >= 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                    Score: {analysis.cvRating}
                                </div>
                            )}
                          </div>
                          <CardTitle className="text-lg mt-3 truncate pr-2 text-zinc-100">
                            {analysis.fileName}
                          </CardTitle>
                          <CardDescription className="text-xs text-zinc-500">
                            {new Date(analysis._creationTime).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Status</span>
                                <span className={
                                    analysis.status === "completed" ? "text-green-400 font-medium" :
                                    analysis.status === "failed" ? "text-red-400 font-medium" :
                                    "text-yellow-400 font-medium"
                                }>
                                    {analysis.status === "completed" ? "Completed" : 
                                     analysis.status === "failed" ? "Failed" : "Processing..."}
                                </span>
                            </div>
                            {analysis.skills && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {analysis.skills.slice(0, 3).map((skill: string, i: number) => (
                                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                                            {skill}
                                        </span>
                                    ))}
                                    {analysis.skills.length > 3 && (
                                        <span className="text-[10px] px-2 py-0.5 text-zinc-500">
                                            +{analysis.skills.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}