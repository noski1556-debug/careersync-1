import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;
import { useQuery } from "convex/react";
import type { FunctionReference } from "convex/server";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, ChevronDown, ChevronUp, Crown, Download, ExternalLink, GraduationCap, Lightbulb, Loader2, Lock, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { AccountDropdown } from "@/components/AccountDropdown";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Analysis() {
  const { id } = useParams<{ id: string }>();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());

  const toggleCourseExpansion = (index: number) => {
    setExpandedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleDownloadData = () => {
    if (!analysis || analysis.status !== "completed") return;

    const dataToDownload = {
      fileName: analysis.fileName,
      cvRating: analysis.cvRating,
      experienceLevel: analysis.experienceLevel,
      skills: analysis.skills,
      missingSkills: analysis.missingSkills,
      learningRoadmap: analysis.learningRoadmap,
      jobMatches: analysis.jobMatches,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `career-analysis-${analysis.fileName.replace(/\.[^/.]+$/, "")}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const analysis = useQuery(
    api.careersync.getAnalysis as FunctionReference<"query">, 
    id && id !== ":id" ? { analysisId: id as Id<"cvAnalyses"> } : "skip"
  );
  const isPro = useQuery(api.careersync.checkProStatus as FunctionReference<"query">);

  if (authLoading) {
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

  if (analysis === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Analysis not found</h2>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const showLimitedContent = !isPro;

  // Determine progress percentage based on status
  const getProgressInfo = () => {
    switch (analysis.status) {
      case "pending":
        return { percent: 10, message: analysis.progressMessage || "Starting analysis..." };
      case "extracting_skills":
        return { percent: 30, message: analysis.progressMessage || "Extracting skills..." };
      case "analyzing_experience":
        return { percent: 60, message: analysis.progressMessage || "Analyzing experience..." };
      case "generating_roadmap":
        return { percent: 85, message: analysis.progressMessage || "Generating roadmap..." };
      case "completed":
        return { percent: 100, message: "Analysis complete!" };
      default:
        return { percent: 0, message: "Processing..." };
    }
  };

  const progressInfo = getProgressInfo();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Logo />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analysis?.status === "completed" && (
              <Button onClick={handleDownloadData} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Data
              </Button>
            )}
            {!isPro && (
              <Button onClick={() => navigate("/pricing")} className="gap-2">
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
            <ThemeToggle />
            <AccountDropdown />
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Your Career Analysis
            </h1>
            <p className="text-muted-foreground text-lg">
              {analysis.fileName}
            </p>
          </div>

          {/* CV Rating Section */}
          {analysis.status === "completed" && analysis.cvRating !== undefined && (
            <Card className="mb-8 border-2 border-primary/20">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary mb-1">
                        {analysis.cvRating}
                      </div>
                      <div className="text-sm text-muted-foreground">CV Score</div>
                    </div>
                    <div className="h-16 w-px bg-border" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {analysis.cvRating >= 90 ? "🏆 Exceptional - Top 5%" : 
                         analysis.cvRating >= 80 ? "⭐ Excellent - Strong Candidate" : 
                         analysis.cvRating >= 70 ? "✓ Good - Competitive" : 
                         analysis.cvRating >= 60 ? "⚠️ Average - Needs Work" : 
                         analysis.cvRating >= 50 ? "❌ Below Average - Major Issues" : 
                         "🚫 Weak - Immediate Revision Required"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Evaluated on: quantified achievements, structure, clarity, impact, and market competitiveness
                      </p>
                    </div>
                  </div>
                  {isPro && analysis.cvRating < 90 && (
                    <Button onClick={() => navigate(`/cv-improvement/${id}`)} variant="outline" className="gap-2">
                      <Crown className="h-4 w-4" />
                      Improve Your CV
                    </Button>
                  )}
                  {!isPro && analysis.cvRating < 90 && (
                    <Button onClick={() => navigate("/pricing")} variant="outline" className="gap-2">
                      <Lock className="h-4 w-4" />
                      Unlock CV Improvement
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.status !== "completed" && analysis.status !== "failed" && (
            <Card className="mb-8">
              <CardContent className="py-12">
                <div className="space-y-6">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-lg font-semibold mb-2">{progressInfo.message}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      This usually takes 30-60 seconds
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressInfo.percent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      {progressInfo.percent}% complete
                    </p>
                  </div>

                  {/* Progress Steps */}
                  <div className="max-w-2xl mx-auto grid grid-cols-4 gap-4 mt-8">
                    {[
                      { label: "Extracting Skills", status: "extracting_skills" },
                      { label: "Analyzing Experience", status: "analyzing_experience" },
                      { label: "Generating Roadmap", status: "generating_roadmap" },
                      { label: "Finalizing", status: "completed" },
                    ].map((step, idx) => {
                      const isActive = analysis.status === step.status;
                      const isComplete = ["extracting_skills", "analyzing_experience", "generating_roadmap", "completed"].indexOf(analysis.status) > idx;
                      
                      return (
                        <div key={idx} className="text-center">
                          <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-semibold ${
                            isComplete ? "bg-primary text-primary-foreground" :
                            isActive ? "bg-primary/20 text-primary animate-pulse" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {isComplete ? "✓" : idx + 1}
                          </div>
                          <p className="text-xs text-muted-foreground">{step.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.status === "failed" && (
            <Card className="mb-8 border-destructive">
              <CardContent className="py-12 text-center">
                <p className="text-lg font-semibold mb-2 text-destructive">Analysis Failed</p>
                <p className="text-muted-foreground mb-4">We encountered an error while analyzing your CV.</p>
                <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              </CardContent>
            </Card>
          )}

          {analysis.status === "completed" && (
            <div className="space-y-6">
              {/* Skills Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your Top Skills
                  </CardTitle>
                  <CardDescription>
                    Experience Level: <strong>{analysis.experienceLevel}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills?.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-sm bg-primary/20 text-foreground border-primary/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Missing Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Skills to Unlock Your Next Role
                  </CardTitle>
                  <CardDescription>
                    Trending skills that will boost your career
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills?.slice(0, showLimitedContent ? 2 : undefined).map((skill: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-sm bg-accent/20 text-foreground border-accent/40">
                        {skill}
                      </Badge>
                    ))}
                    {showLimitedContent && analysis.missingSkills && analysis.missingSkills.length > 2 && (
                      <Badge variant="outline" className="text-sm opacity-50">
                        <Lock className="h-3 w-3 mr-1" />
                        +{analysis.missingSkills.length - 2} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Roadmap */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Your 6-Week Learning Roadmap
                  </CardTitle>
                  <CardDescription>
                    Personalized courses to level up your skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.learningRoadmap?.slice(0, showLimitedContent ? 3 : undefined).map((item: any, idx: number) => {
                      const isExpanded = expandedCourses.has(idx);
                      return (
                        <div key={idx} className="border rounded-lg overflow-hidden">
                          <div className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              W{item.week}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{item.skill}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{item.course}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{item.platform}</span>
                                <span>•</span>
                                <span>{item.hours} hours</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                              {(item.tips || item.practiceExercises) && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => toggleCourseExpansion(idx)}
                                  className="text-xs"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="h-3 w-3 mr-1" />
                                      Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3 mr-1" />
                                      More Info
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {isExpanded && (item.tips || item.practiceExercises) && (
                            <div className="px-4 pb-4 pt-2 bg-gradient-to-br from-primary/5 to-accent/5 border-t space-y-3">
                              {item.tips && (
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-primary" />
                                    <h5 className="font-semibold text-sm">Learning Tips</h5>
                                  </div>
                                  <p className="text-sm text-muted-foreground pl-6">{item.tips}</p>
                                </div>
                              )}
                              {item.practiceExercises && (
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap className="h-4 w-4 text-primary" />
                                    <h5 className="font-semibold text-sm">Practice Exercises</h5>
                                  </div>
                                  <p className="text-sm text-muted-foreground pl-6">{item.practiceExercises}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {showLimitedContent && analysis.learningRoadmap && analysis.learningRoadmap.length > 3 && (
                    <div className="mt-6 p-6 border-2 border-dashed rounded-lg text-center bg-muted/30">
                      <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <h4 className="font-semibold mb-2">Unlock Full Roadmap</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upgrade to Pro to see all {analysis.learningRoadmap.length} weeks of personalized learning
                      </p>
                      <Button onClick={() => navigate("/pricing")}>
                        Start 7-Day Free Trial
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Feedback Prompt */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 w-8 bg-muted/50" />
                <div className="absolute inset-y-0 right-0 w-8 bg-muted/50" />
                <Card className="relative bg-white dark:bg-card">
                  <CardContent className="py-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Help Us Improve Your Experience</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your feedback helps us create better roadmaps for everyone
                    </p>
                    <Button asChild variant="default">
                      <a 
                        href="https://forms.gle/bTT9gZgXXTRoDCzZ6" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        Share Your Feedback
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Job Matches */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Job Matches You Could Qualify For
                  </CardTitle>
                  <CardDescription>
                    Roles that match your skills and experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.jobMatches?.slice(0, showLimitedContent ? 1 : undefined).map((job: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow relative">
                        <div className="flex items-start gap-4 relative z-0">
                          {job.companyLogo && (
                            <div className="flex-shrink-0">
                              <img 
                                src={job.companyLogo} 
                                alt={`${job.company} logo`}
                                className="w-12 h-12 rounded-lg object-contain bg-white border p-1"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-lg">{job.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {job.companyWebsite ? (
                                    <a 
                                      href={job.companyWebsite} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline inline-flex items-center gap-1 relative z-10 cursor-pointer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {job.company}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    job.company
                                  )}
                                </p>
                              </div>
                              <Badge variant="secondary" className="ml-2">{job.matchScore}% match</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{job.salary}</span>
                              <span>•</span>
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {showLimitedContent && analysis.jobMatches && analysis.jobMatches.length > 1 && (
                    <div className="mt-6 p-6 border-2 border-dashed rounded-lg text-center bg-muted/30">
                      <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <h4 className="font-semibold mb-2">Unlock 5x More Job Matches</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        See {analysis.jobMatches.length - 1} more personalized job recommendations plus salary forecasts
                      </p>
                      <Button onClick={() => navigate("/pricing")}>
                        Upgrade to Pro
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}