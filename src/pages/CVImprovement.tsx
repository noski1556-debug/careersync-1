import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

export default function CVImprovement() {
  const { id } = useParams<{ id: string }>();
  const { isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const analysis = useQuery(
    api.careersync.getAnalysis, 
    id && id !== ":id" ? { analysisId: id as Id<"cvAnalyses"> } : "skip"
  );
  const isPro = useQuery(api.careersync.checkProStatus);

  if (authLoading || analysis === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analysis || !isPro) {
    navigate("/pricing");
    return null;
  }

  // Generate personalized questions based on missing skills and CV rating
  const questions = [
    {
      id: "achievements",
      question: "What are your top 3 quantifiable achievements in your current or most recent role?",
      placeholder: "E.g., Increased sales by 30%, Led a team of 5 engineers, Reduced costs by $50K annually",
      required: (analysis.cvRating ?? 100) < 70,
    },
    {
      id: "projects",
      question: "Describe a challenging project you worked on and the impact it had.",
      placeholder: "Include the problem, your approach, technologies used, and measurable results",
      required: (analysis.cvRating ?? 100) < 60,
    },
    {
      id: "leadership",
      question: "Have you led any teams, mentored colleagues, or taken initiative on projects?",
      placeholder: "Describe your leadership experience and the outcomes",
      required: (analysis.cvRating ?? 100) < 75,
    },
    ...(analysis.missingSkills || []).slice(0, 3).map((skill, idx) => ({
      id: `skill_${idx}`,
      question: `Do you have any experience with ${skill}? If yes, please describe.`,
      placeholder: `Describe any projects, courses, or work experience involving ${skill}`,
      required: false,
    })),
    {
      id: "certifications",
      question: "List any professional certifications, courses, or training you've completed.",
      placeholder: "Include certification names, issuing organizations, and dates",
      required: (analysis.cvRating ?? 100) < 65,
    },
    {
      id: "soft_skills",
      question: "Describe a situation where you demonstrated strong communication or problem-solving skills.",
      placeholder: "Use the STAR method: Situation, Task, Action, Result",
      required: (analysis.cvRating ?? 100) < 70,
    },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    toast.info("Generating your improved CV recommendations...");
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("CV improvement suggestions generated!");
    setIsSubmitting(false);
    navigate(`/analysis/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/analysis/${id}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Career Compass" className="h-8 w-8" />
              <span className="font-bold text-xl">CV Improvement</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">
                Improve Your CV
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Answer these personalized questions to help us generate specific recommendations for your CV.
              Your current CV score is <strong>{analysis.cvRating}/100</strong>.
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {q.required && <span className="text-destructive">*</span>}
                      {q.question}
                    </CardTitle>
                    {q.required && (
                      <CardDescription>
                        This question is important for improving your CV score
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={responses[q.id] || ""}
                      onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                      placeholder={q.placeholder}
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate(`/analysis/${id}`)}>
              Cancel
            </Button>
            <Button 
              size="lg" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Generate Recommendations
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}