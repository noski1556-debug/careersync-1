import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Store CV upload and analysis
export const createCVAnalysis = mutation({
  args: {
    fileName: v.string(),
    fileStorageId: v.id("_storage"),
    extractedText: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const analysisId = await ctx.db.insert("cvAnalyses", {
      userId: user._id,
      fileName: args.fileName,
      fileStorageId: args.fileStorageId,
      extractedText: args.extractedText,
      status: "pending",
    });

    return analysisId;
  },
});

// Update analysis with AI results (internal only)
export const updateAnalysisResults = internalMutation({
  args: {
    analysisId: v.id("cvAnalyses"),
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
    })),
    jobMatches: v.array(v.object({
      title: v.string(),
      company: v.string(),
      matchScore: v.number(),
      salary: v.string(),
      location: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.analysisId, {
      skills: args.skills,
      experienceLevel: args.experienceLevel,
      missingSkills: args.missingSkills,
      learningRoadmap: args.learningRoadmap,
      jobMatches: args.jobMatches,
      status: "completed",
    });
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

// Check if user has pro subscription
export const checkProStatus = query({
  args: {},
  handler: async (ctx) => {
    // Temporarily return true for testing Pro features without authentication
    return true;
    
    /* Original code - commented out for testing
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!subscription) return false;

    // Check if subscription is active and not expired
    return subscription.status === "active" && subscription.currentPeriodEnd > Date.now();
    */
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