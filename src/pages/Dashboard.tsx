import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Loader2, Upload, Sparkles, Crown, Copy, Gift } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  const analyses = useQuery(api.careersync.getUserAnalyses);
  const isPro = useQuery(api.careersync.checkProStatus);
  const referralStats = useQuery(api.referrals.getUserReferralStats);
  const createAnalysis = useMutation(api.careersync.createCVAnalysis);
  const analyzeCV = useAction(api.aiAnalysis.analyzeCV);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const checkRateLimit = useMutation(api.careersync.checkRateLimit);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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

    // TESTING: Freemium limit disabled for testing
    // if (!isPro && analyses && analyses.length >= 1) {
    //   toast.error("Upgrade to Pro for unlimited CV scans", {
    //     action: {
    //       label: "Upgrade",
    //       onClick: () => navigate("/pricing"),
    //     },
    //   });
    //   return;
    // }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="CareerSync" className="h-8 w-8" />
            <span className="font-bold text-xl">CareerSync</span>
          </div>
          <div className="flex items-center gap-4">
            {!isPro && (
              <Button variant="outline" onClick={() => navigate("/pricing")} className="gap-2">
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              {user?.email || "Test User"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Welcome back, {user?.name || "Test User"}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to unlock your next career opportunity?
            </p>
          </div>

          {/* Referral Card */}
          {referralStats?.referralCode && (
            <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Refer Friends & Earn Rewards
                </CardTitle>
                <CardDescription>
                  Share your code and get 20% off Pro for 12 months. Refer 3 friends to unlock 3 months free Pro!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-2xl font-bold bg-background px-4 py-2 rounded border">
                        {referralStats.referralCode}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyReferralCode}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Progress: {referralStats.credits}/3 referrals • {referralStats.totalValidReferrals} total successful referrals
                    </p>
                    {referralStats.activeRewards && referralStats.activeRewards.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {referralStats.activeRewards.map((reward, idx) => (
                          <span key={idx} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            {reward.rewardType === "discount" 
                              ? `${reward.discountPercentage}% off for ${reward.durationMonths} months` 
                              : `${reward.durationMonths} months free Pro`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-auto">
                    <div className="h-2 w-full md:w-48 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(referralStats.credits / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Section */}
          <Card className="mb-8 border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your CV
              </CardTitle>
              <CardDescription>
                Upload your CV and let AI analyze your skills and career potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <input
                  type="file"
                  id="cv-upload"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label htmlFor="cv-upload">
                  <Button
                    size="lg"
                    disabled={uploading}
                    className="gap-2"
                    asChild
                  >
                    <span>
                      {uploading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Upload CV (PDF or DOCX)
                        </>
                      )}
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-muted-foreground mt-4">
                  {isPro ? "Unlimited scans (Pro Mode - Testing)" : `${analyses?.length || 0}/1 free scan used`}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Don't have a CV?{" "}
                  <button
                    onClick={() => navigate("/cv-builder")}
                    className="text-primary underline hover:text-primary/80 transition-colors"
                  >
                    Build one with AI
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Previous Analyses */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Your Analyses</h2>
            {!analyses || analyses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No analyses yet. Upload your CV to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {analyses.map((analysis) => (
                  <motion.div
                    key={analysis._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate(`/analysis/${analysis._id}`)}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="truncate">{analysis.fileName}</span>
                          <ArrowRight className="h-4 w-4 flex-shrink-0" />
                        </CardTitle>
                        <CardDescription>
                          {analysis.status === "completed" ? (
                            <span className="text-green-600">✓ Analysis complete</span>
                          ) : analysis.status === "failed" ? (
                            <span className="text-red-600">✗ Failed</span>
                          ) : (
                            <span className="text-yellow-600">⏳ {analysis.progressMessage || "Analyzing..."}</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      {analysis.status === "completed" && analysis.skills && (
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.skills.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                            {analysis.skills.length > 4 && (
                              <span className="text-xs text-muted-foreground">
                                +{analysis.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}