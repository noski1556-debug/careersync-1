import { query } from "../_generated/server";
import { v } from "convex/values";

export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
    
    return {
      exists: existingUser !== null,
      hasName: existingUser?.name ? true : false,
    };
  },
});
