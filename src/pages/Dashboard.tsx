import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Loader2, Upload, Sparkles, Crown } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  const analyses = useQuery(api.careersync.getUserAnalyses);
  const isPro = useQuery(api.careersync.checkProStatus);
  const createAnalysis = useMutation(api.careersync.createCVAnalysis);
  const analyzeCV = useAction(api.aiAnalysis.analyzeCV);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // Temporarily disable authentication check for testing
  /*
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
  */

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }

    // Temporarily disable freemium limit check for testing
    /*
    if (!isPro && analyses && analyses.length >= 1) {
      toast.error("Upgrade to Pro for unlimited CV scans", {
        action: {
          label: "Upgrade",
          onClick: () => navigate("/pricing"),
        },
      });
      return;
    }
    */

    setUploading(true);
    toast.info("Uploading your CV...");

    try {
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

      // Ask for user location
      const userLocation = prompt("Where are you located? (City, Country)\nThis helps us provide personalized job recommendations near you:");

      // Create analysis record
      const analysisId = await createAnalysis({
        fileName: file.name,
        fileStorageId: storageId,
        extractedText,
        userLocation: userLocation || undefined,
      });

      toast.success("CV uploaded! Analyzing...");

      // Trigger AI analysis
      await analyzeCV({
        analysisId,
        extractedText,
        userLocation: userLocation || undefined,
      });

      toast.success("Analysis complete!");
      navigate(`/analysis/${analysisId}`);
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
                          ) : analysis.status === "pending" ? (
                            <span className="text-yellow-600">⏳ Analyzing...</span>
                          ) : (
                            <span className="text-red-600">✗ Failed</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      {analysis.status === "completed" && analysis.skills && (
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.skills.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
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