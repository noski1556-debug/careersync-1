// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { emailOtp } from "./auth/emailOtp";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailOtp, Anonymous],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      // Initialize new users with referral code
      if (args.existingUserId === undefined) {
        // This is a new user
        await ctx.scheduler.runAfter(0, internal.users.initializeNewUser, {
          userId: args.userId,
        });
      }
      
      // Store the name from the authentication form if provided
      if (args.profile?.name) {
        await ctx.db.patch(args.userId, {
          name: args.profile.name as string,
        });
      }
    },
  },
});