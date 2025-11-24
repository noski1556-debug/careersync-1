import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Mountain } from "lucide-react";
import { useNavigate } from "react-router";

interface RecentAnalysesProps {
  analyses: any[];
  hasReferralCode: boolean;
}

export function RecentAnalyses({ analyses, hasReferralCode }: RecentAnalysesProps) {
  const navigate = useNavigate();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={item} className={hasReferralCode ? "md:col-span-3" : "md:col-span-2"}>
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
              whileHover={{ scale: 1.05 }}
              className="h-full"
            >
              <Card 
                className="cursor-pointer h-full bg-black/20 backdrop-blur-md border border-white/10 hover:border-primary hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 group"
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
  );
}
