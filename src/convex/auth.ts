// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { password } from "./auth/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [password, Anonymous],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      // Store the name from the authentication form if provided
      if (args.profile?.name) {
        await ctx.db.patch(args.userId, {
          name: args.profile.name as string,
        });
      }
      
      // Initialize new users with referral code
      if (args.existingUserId === undefined) {
        // This is a new user - we'll handle referral code creation via a separate mechanism
        // The referral code will be created on first dashboard visit or via a separate initialization
      }
    },
  },
});