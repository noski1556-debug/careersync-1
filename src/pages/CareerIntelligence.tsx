import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Briefcase, DollarSign, Target, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { AccountDropdown } from "@/components/AccountDropdown";

// Mock data for visualizations
const mockData = {
  skillMatch: 87,
  jobDemand: [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 70 },
    { month: "Mar", value: 75 },
    { month: "Apr", value: 82 },
    { month: "May", value: 88 },
    { month: "Jun", value: 92 },
  ],
  salaryProjection: {
    current: 45000,
    projected: 62000,
  },
  missingSkills: [
    { name: "Docker", demand: 85 },
    { name: "TypeScript", demand: 78 },
    { name: "GraphQL", demand: 72 },
  ],
};

export default function CareerIntelligence() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
              <img src="https://harmless-tapir-303.convex.cloud/api/storage/57773ec8-d3be-4674-bfed-acc0f2344bc0" alt="Career Compass" className="h-8 w-auto" />
              <span className="font-bold text-xl">Career Compass</span>
            </div>
          </div>
          <AccountDropdown />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="mb-12 text-center">
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Insights
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Career Intelligence Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Your personalized career insights at a glance
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Skill Match Percentage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Skill Match
                  </CardTitle>
                  <CardDescription>Match with target roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <div className="relative">
                      <svg className="w-48 h-48 transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 80}`}
                          strokeDashoffset={`${2 * Math.PI * 80 * (1 - mockData.skillMatch / 100)}`}
                          className="text-primary transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-primary">{mockData.skillMatch}%</div>
                          <div className="text-sm text-muted-foreground">Match Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Job Demand Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Job Demand Trend
                  </CardTitle>
                  <CardDescription>Market demand for your skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2 px-4">
                    {mockData.jobDemand.map((point, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          className="w-full bg-gradient-to-t from-accent to-accent/50 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: `${point.value}%` }}
                          transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                        />
                        <span className="text-xs text-muted-foreground">{point.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm font-semibold text-green-600">↑ 42% increase</span>
                    <span className="text-sm text-muted-foreground"> in last 6 months</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Salary Projection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    Salary Projection
                  </CardTitle>
                  <CardDescription>Potential earnings in 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 py-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Current</span>
                        <span className="text-2xl font-bold">€{mockData.salaryProjection.current.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-muted-foreground to-muted-foreground/70"
                          initial={{ width: 0 }}
                          animate={{ width: "72%" }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Projected</span>
                        <span className="text-2xl font-bold text-secondary">€{mockData.salaryProjection.projected.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-secondary to-secondary/70"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm font-semibold text-green-600">+€{(mockData.salaryProjection.projected - mockData.salaryProjection.current).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground"> potential increase</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top 3 Missing Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Top 3 Missing Skills
                  </CardTitle>
                  <CardDescription>Skills to learn for career growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 py-4">
                    {mockData.missingSkills.map((skill, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.demand}% demand</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.demand}%` }}
                            transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Pro Tip Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">💡 Pro Tip</h3>
                    <p className="text-muted-foreground mb-4">
                      Focus on learning Docker first — it has the highest market demand (85%) and will boost your salary potential by an estimated 15-20%. Start with free courses on YouTube or freeCodeCamp.
                    </p>
                    <Button onClick={() => navigate("/dashboard")} className="gap-2">
                      Get Detailed Analysis
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            className="text-center text-sm text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            📊 Data updates weekly based on market trends • Last updated: Today
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}