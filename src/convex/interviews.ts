import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get all interviews for the current user
export const getUserInterviews = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return interviews;
  },
});

// Add a new interview
export const addInterview = mutation({
  args: {
    companyName: v.string(),
    position: v.string(),
    interviewDate: v.number(),
    rating: v.number(),
    notes: v.optional(v.string()),
    hasSecondInterview: v.boolean(),
    secondInterviewDate: v.optional(v.number()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Validate rating is between 1-10
    if (args.rating < 1 || args.rating > 10) {
      throw new Error("Rating must be between 1 and 10");
    }

    const interviewId = await ctx.db.insert("interviews", {
      userId,
      companyName: args.companyName,
      position: args.position,
      interviewDate: args.interviewDate,
      rating: args.rating,
      notes: args.notes,
      hasSecondInterview: args.hasSecondInterview,
      secondInterviewDate: args.secondInterviewDate,
      status: args.status,
    });

    return interviewId;
  },
});

// Update an existing interview
export const updateInterview = mutation({
  args: {
    interviewId: v.id("interviews"),
    companyName: v.optional(v.string()),
    position: v.optional(v.string()),
    interviewDate: v.optional(v.number()),
    rating: v.optional(v.number()),
    notes: v.optional(v.string()),
    hasSecondInterview: v.optional(v.boolean()),
    secondInterviewDate: v.optional(v.number()),
    status: v.optional(v.string()),
    tips: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const interview = await ctx.db.get(args.interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    if (interview.userId !== userId) {
      throw new Error("Not authorized");
    }

    // Validate rating if provided
    if (args.rating !== undefined && (args.rating < 1 || args.rating > 10)) {
      throw new Error("Rating must be between 1 and 10");
    }

    const updates: any = {};
    if (args.companyName !== undefined) updates.companyName = args.companyName;
    if (args.position !== undefined) updates.position = args.position;
    if (args.interviewDate !== undefined) updates.interviewDate = args.interviewDate;
    if (args.rating !== undefined) updates.rating = args.rating;
    if (args.notes !== undefined) updates.notes = args.notes;
    if (args.hasSecondInterview !== undefined) updates.hasSecondInterview = args.hasSecondInterview;
    if (args.secondInterviewDate !== undefined) updates.secondInterviewDate = args.secondInterviewDate;
    if (args.status !== undefined) updates.status = args.status;
    if (args.tips !== undefined) updates.tips = args.tips;

    await ctx.db.patch(args.interviewId, updates);

    return args.interviewId;
  },
});

// Delete an interview
export const deleteInterview = mutation({
  args: {
    interviewId: v.id("interviews"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const interview = await ctx.db.get(args.interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    if (interview.userId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.interviewId);
  },
});

// Get interview count for stats
export const getInterviewCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return 0;
    }

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return interviews.length;
  },
});
