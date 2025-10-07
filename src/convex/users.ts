import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (user === null) {
      return null;
    }

    return user;
  },
});

/**
 * Use this function internally to get the current user data. Remember to handle the null user case.
 * @param ctx
 * @returns
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
};

// Initialize new user with referral code
export const initializeNewUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Create referral code for new user
    await ctx.scheduler.runAfter(0, internal.referrals.createReferralCode, {
      userId: args.userId,
    });
  },
});