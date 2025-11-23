import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

// Store CV upload and analysis
export const createCVAnalysis = mutation({
  args: {
    fileName: v.string(),
    fileStorageId: v.id("_storage"),
    extractedText: v.string(),
    userLocation: v.optional(v.string()),
    contentHash: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check for cached analysis (within last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const cachedAnalysis = await ctx.db
      .query("cvAnalyses")
      .withIndex("by_contentHash", (q) => q.eq("contentHash", args.contentHash))
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "completed"),
          q.gt(q.field("_creationTime"), sevenDaysAgo)
        )
      )
      .first();

    if (cachedAnalysis) {
      // Return cached analysis by creating a new record with same results
      const analysisId = await ctx.db.insert("cvAnalyses", {
        userId: user._id,
        fileName: args.fileName,
        fileStorageId: args.fileStorageId,
        extractedText: args.extractedText,
        contentHash: args.contentHash,
        userLocation: args.userLocation,
        status: "completed",
        cvRating: cachedAnalysis.cvRating,
        skills: cachedAnalysis.skills,
        experienceLevel: cachedAnalysis.experienceLevel,
        missingSkills: cachedAnalysis.missingSkills,
        learningRoadmap: cachedAnalysis.learningRoadmap,
        jobMatches: cachedAnalysis.jobMatches,
      });
      
      // Mark CV scan completed for referral tracking
      // Note: Referral tracking is handled separately to avoid type issues
      // await ctx.scheduler.runAfter(
      //   0,
      //   internal.referrals.markCVScanCompleted,
      //   {
      //     userId: user._id,
      //   },
      // );
      
      return { analysisId, cached: true };
    }

    const analysisId = await ctx.db.insert("cvAnalyses", {
      userId: user._id,
      fileName: args.fileName,
      fileStorageId: args.fileStorageId,
      extractedText: args.extractedText,
      contentHash: args.contentHash,
      userLocation: args.userLocation,
      status: "pending",
      progressMessage: "Starting analysis...",
    });

    return { analysisId, cached: false };
  },
});

// Update progress message (internal only)
export const updateProgressMessage = internalMutation({
  args: {
    analysisId: v.id("cvAnalyses"),
    status: v.string(),
    progressMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.analysisId, {
      status: args.status,
      progressMessage: args.progressMessage,
    });
  },
});

// Update analysis with AI results (internal only)
export const updateAnalysisResults = internalMutation({
  args: {
    analysisId: v.id("cvAnalyses"),
    cvRating: v.number(),
    skills: v.array(v.string()),
    experienceLevel: v.string(),
    missingSkills: v.array(v.string()),
    learningRoadmap: v.array(v.object({
      week: v.number(),
      skill: v.string(),
      course: v.string(),
      platform: v.string(),
      hours: v.number(),
      link: v.string(),
      tips: v.optional(v.string()),
      practiceExercises: v.optional(v.string()),
    })),
    jobMatches: v.array(v.object({
      title: v.string(),
      company: v.string(),
      companyWebsite: v.optional(v.string()),
      companyLogo: v.optional(v.string()),
      matchScore: v.number(),
      salary: v.string(),
      location: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis) throw new Error("Analysis not found");
    
    await ctx.db.patch(args.analysisId, {
      cvRating: args.cvRating,
      skills: args.skills,
      experienceLevel: args.experienceLevel,
      missingSkills: args.missingSkills,
      learningRoadmap: args.learningRoadmap,
      jobMatches: args.jobMatches,
      status: "completed",
      progressMessage: "Analysis complete!",
    });
    
    // Mark CV scan completed for referral tracking
    // Note: Referral tracking is handled separately to avoid type issues
    // await ctx.scheduler.runAfter(0, internal.referrals.markCVScanCompleted, {
    //   userId: analysis.userId,
    // });
  },
});

// Check rate limit
export const checkRateLimit = mutation({
  args: {
    ipAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;

    const rateLimit = await ctx.db
      .query("rateLimits")
      .withIndex("by_ipAddress", (q) => q.eq("ipAddress", args.ipAddress))
      .first();

    if (rateLimit && rateLimit.lastScanTime > oneMinuteAgo) {
      const secondsRemaining = Math.ceil((rateLimit.lastScanTime + 60 * 1000 - now) / 1000);
      return { allowed: false, secondsRemaining };
    }

    // Update or create rate limit record
    if (rateLimit) {
      await ctx.db.patch(rateLimit._id, {
        lastScanTime: now,
        scanCount: rateLimit.scanCount + 1,
      });
    } else {
      await ctx.db.insert("rateLimits", {
        ipAddress: args.ipAddress,
        lastScanTime: now,
        scanCount: 1,
      });
    }

    return { allowed: true, secondsRemaining: 0 };
  },
});

// Get user's CV analyses
export const getUserAnalyses = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const analyses = await ctx.db
      .query("cvAnalyses")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return analyses;
  },
});

// Get specific analysis
export const getAnalysis = query({
  args: { analysisId: v.id("cvAnalyses") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis || analysis.userId !== user._id) return null;

    return analysis;
  },
});

// Get aggregated career intelligence data
export const getCareerIntelligence = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const analyses = await ctx.db
      .query("cvAnalyses")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("asc")
      .collect();

    const completedAnalyses = analyses.filter((a) => a.status === "completed");

    if (completedAnalyses.length === 0) {
      return null;
    }

    const latest = completedAnalyses[completedAnalyses.length - 1];

    // 1. Skill Match (Use CV Rating as proxy)
    const skillMatch = latest.cvRating || 0;

    // 2. Trend (CV Rating over time)
    // Take last 6 analyses or fewer
    const trendData = completedAnalyses.slice(-6).map((a) => ({
      date: a._creationTime,
      value: a.cvRating || 0,
      label: new Date(a._creationTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    // 3. Salary Projection
    let projectedSalary = 0;
    if (latest.jobMatches && latest.jobMatches.length > 0) {
      const salaries = latest.jobMatches
        .map((m) => {
          // Extract numbers from string like "$120,000 - $150,000" or "€45k"
          const matches = m.salary.match(/(\d{1,3}(,\d{3})*(\.\d+)?)|(\d+[kK])/g);
          if (matches && matches.length > 0) {
             const nums = matches.map(s => {
                let val = parseFloat(s.replace(/,/g, '').replace(/k/i, '000'));
                // Simple heuristic for 'k' notation
                if (s.toLowerCase().includes('k') && val < 1000) val *= 1000; 
                return val;
             });
             return nums.reduce((a, b) => a + b, 0) / nums.length;
          }
          return 0;
        })
        .filter((s) => s > 0);

      if (salaries.length > 0) {
        projectedSalary = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
      }
    }

    // 4. Missing Skills
    const missingSkills = (latest.missingSkills || []).slice(0, 3).map((skill, idx) => ({
      name: skill,
      demand: 95 - idx * 8, // Heuristic: AI prioritizes most important skills
    }));

    return {
      skillMatch,
      trendData,
      salaryProjection: {
        projected: projectedSalary,
      },
      missingSkills,
      topMissingSkill: missingSkills[0]?.name || null,
      lastUpdated: latest._creationTime,
    };
  },
});

// Check if user has pro subscription
export const checkProStatus = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    // TESTING: Always return true for Pro status during development
    return true;

    // Production code (commented out for testing)
    // const subscription = await ctx.db
    //   .query("subscriptions")
    //   .withIndex("by_userId", (q) => q.eq("userId", user._id))
    //   .first();
    //
    // if (!subscription) return false;
    //
    // // Check if subscription is active and not expired
    // return subscription.status === "active" && subscription.currentPeriodEnd > Date.now();
  },
});

// Create subscription (internal for webhook handling)
export const createSubscription = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if subscription already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        stripeSubscriptionId: args.stripeSubscriptionId,
        stripePriceId: args.stripePriceId,
        status: args.status,
        currentPeriodEnd: args.currentPeriodEnd,
      });
      return existing._id;
    }

    return await ctx.db.insert("subscriptions", {
      userId: user._id,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripePriceId: args.stripePriceId,
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
    });
  },
});

// Update subscription status (internal for webhook handling)
export const updateSubscriptionStatus = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripeSubscriptionId", (q) => 
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();

    if (!subscription) throw new Error("Subscription not found");

    await ctx.db.patch(subscription._id, {
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
    });
  },
});