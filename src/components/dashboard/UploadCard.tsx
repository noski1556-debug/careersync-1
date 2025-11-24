import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAction, useMutation } from "convex/react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";

interface UploadCardProps {
  isPro: boolean;
  analysesCount: number;
  user: any;
}

export function UploadCard({ isPro, analysesCount, user }: UploadCardProps) {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  const createAnalysis = useMutation(api.careersync.createCVAnalysis);
  const analyzeCV = useAction(api.aiAnalysis.analyzeCV);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const checkRateLimit = useMutation(api.careersync.checkRateLimit);

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
      const ipAddress = "user-ip-placeholder"; 
      
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

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={item} 
      className="md:col-span-1 md:row-span-2 h-full"
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full border border-white/10 border-dashed bg-black/20 backdrop-blur-md hover:border-primary transition-all duration-300 group relative overflow-hidden shadow-none hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]">
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
            Supports PDF & DOCX • {isPro ? "Unlimited Pro Scans" : `${analysesCount}/1 Free Scan`}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
