import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Briefcase, DollarSign, Target, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { AccountDropdown } from "@/components/AccountDropdown";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CareerIntelligence() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const data = useQuery(api.careersync.getCareerIntelligence);

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

  // Loading state for data
  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Empty state
  if (data === null) {
    return (
      <div className="min-h-screen bg-background">
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
              <ThemeToggle />
              <AccountDropdown />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
          <div className="bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">No Career Intelligence Yet</h1>
          <p className="text-muted-foreground mb-8">
            Upload your first CV in the dashboard to unlock AI-powered career insights, salary projections, and skill gap analysis.
          </p>
          <Button onClick={() => navigate("/dashboard")} size="lg" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
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
              <Logo />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AccountDropdown />
          </div>
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-serif">
              Career Intelligence Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Your personalized career insights based on your latest analysis
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
              <Card className="h-full hover:shadow-xl transition-shadow border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Profile Strength
                  </CardTitle>
                  <CardDescription>Overall CV rating and market fit</CardDescription>
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
                          strokeDashoffset={`${2 * Math.PI * 80 * (1 - data.skillMatch / 100)}`}
                          className="text-primary transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-primary">{data.skillMatch}</div>
                          <div className="text-sm text-muted-foreground">/ 100</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Growth Trajectory
                  </CardTitle>
                  <CardDescription>Your profile improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2 px-4">
                    {data.trendData.length > 0 ? (
                      data.trendData.map((point, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="relative w-full flex justify-center">
                             <motion.div
                                className="w-full max-w-[40px] bg-gradient-to-t from-accent to-accent/50 rounded-t hover:from-accent hover:to-accent/80 transition-colors"
                                initial={{ height: 0 }}
                                animate={{ height: `${point.value}%` }}
                                transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                              />
                              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-sm">
                                {point.value}
                              </div>
                          </div>
                          <span className="text-xs text-muted-foreground truncate w-full text-center">{point.label}</span>
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Not enough data yet
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    {data.trendData.length > 1 && data.trendData[data.trendData.length - 1].value > data.trendData[0].value ? (
                      <span className="text-sm font-semibold text-green-600">
                        ↑ {data.trendData[data.trendData.length - 1].value - data.trendData[0].value} points gained
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Keep improving to see growth</span>
                    )}
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
              <Card className="h-full hover:shadow-xl transition-shadow border-secondary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    Market Value
                  </CardTitle>
                  <CardDescription>Estimated annual salary potential</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 py-4">
                    <div className="text-center py-6">
                      <div className="text-sm text-muted-foreground mb-2">Projected Annual Salary</div>
                      <div className="text-4xl md:text-5xl font-bold text-secondary">
                        {data.salaryProjection.projected > 0 
                          ? `€${data.salaryProjection.projected.toLocaleString()}`
                          : "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Based on matched job opportunities
                      </p>
                    </div>
                    
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-secondary/50 to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                      />
                    </div>
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
              <Card className="h-full hover:shadow-xl transition-shadow border-orange-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-orange-500" />
                    Skill Gaps
                  </CardTitle>
                  <CardDescription>Top skills to learn for career growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 py-4">
                    {data.missingSkills.length > 0 ? (
                      data.missingSkills.map((skill, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">High Impact</span>
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
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No major skill gaps found!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Pro Tip Callout */}
          {data.topMissingSkill && (
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
                      <h3 className="font-semibold text-lg mb-2">💡 AI Recommendation</h3>
                      <p className="text-muted-foreground mb-4">
                        Focus on learning <strong>{data.topMissingSkill}</strong> first. 
                        Our analysis indicates it's a high-leverage skill for your target roles. 
                        Check your learning roadmap for curated resources.
                      </p>
                      <Button onClick={() => navigate("/dashboard")} className="gap-2">
                        View Learning Roadmap
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Footer Note */}
          <motion.p
            className="text-center text-sm text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            📊 Data based on your analysis from {new Date(data.lastUpdated).toLocaleDateString()}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}