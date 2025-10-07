import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Referral system
      referralCredits: v.optional(v.number()), // Number of valid referrals (resets at 3)
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Referral Codes
    referralCodes: defineTable({
      userId: v.id("users"),
      code: v.string(), // Format: CAREER-XXXX
    })
      .index("by_userId", ["userId"])
      .index("by_code", ["code"]),

    // Referral Tracking
    referrals: defineTable({
      referrerId: v.id("users"), // User who shared the code
      referredUserId: v.id("users"), // User who signed up with code
      referralCode: v.string(),
      status: v.string(), // "pending" | "valid" | "invalid"
      cvScanCompleted: v.boolean(),
      totalSessionTime: v.number(), // in seconds
      validatedAt: v.optional(v.number()),
      ipAddress: v.string(),
      deviceFingerprint: v.optional(v.string()),
    })
      .index("by_referrerId", ["referrerId"])
      .index("by_referredUserId", ["referredUserId"])
      .index("by_referralCode", ["referralCode"])
      .index("by_status", ["status"]),

    // Referral Rewards
    referralRewards: defineTable({
      userId: v.id("users"),
      rewardType: v.string(), // "discount" | "free_pro"
      discountPercentage: v.optional(v.number()), // e.g., 20 for 20% off
      durationMonths: v.optional(v.number()), // e.g., 12 for discount, 3 for free Pro
      appliedAt: v.number(),
      expiresAt: v.number(),
      isActive: v.boolean(),
    }).index("by_userId", ["userId"]),

    // Session Tracking
    userSessions: defineTable({
      userId: v.id("users"),
      sessionStart: v.number(),
      lastPing: v.number(),
      totalDuration: v.number(), // in seconds
      isActive: v.boolean(),
    }).index("by_userId", ["userId"]),

    // CV Analysis storage
    cvAnalyses: defineTable({
      userId: v.id("users"),
      fileName: v.string(),
      fileStorageId: v.id("_storage"),
      extractedText: v.string(),
      contentHash: v.optional(v.string()), // SHA-256 hash for caching
      status: v.string(), // "pending" | "extracting_skills" | "analyzing_experience" | "generating_roadmap" | "completed" | "failed"
      progressMessage: v.optional(v.string()), // Current progress message for UI
      userLocation: v.optional(v.string()), // User's location for personalized recommendations
      
      // AI Analysis Results
      cvRating: v.optional(v.number()), // CV quality rating 0-100
      skills: v.optional(v.array(v.string())),
      experienceLevel: v.optional(v.string()),
      missingSkills: v.optional(v.array(v.string())),
      learningRoadmap: v.optional(v.array(v.object({
        week: v.number(),
        skill: v.string(),
        course: v.string(),
        platform: v.string(),
        hours: v.number(),
        link: v.string(),
        tips: v.optional(v.string()),
        practiceExercises: v.optional(v.string()),
      }))),
      jobMatches: v.optional(v.array(v.object({
        title: v.string(),
        company: v.string(),
        companyWebsite: v.optional(v.string()),
        companyLogo: v.optional(v.string()),
        matchScore: v.number(),
        salary: v.string(),
        location: v.string(),
      }))),
    })
      .index("by_userId", ["userId"])
      .index("by_contentHash", ["contentHash"]),

    // Rate Limiting
    rateLimits: defineTable({
      ipAddress: v.string(),
      lastScanTime: v.number(),
      scanCount: v.number(),
    }).index("by_ipAddress", ["ipAddress"]),

    // Subscriptions
    subscriptions: defineTable({
      userId: v.id("users"),
      stripeSubscriptionId: v.string(),
      stripePriceId: v.string(),
      status: v.string(), // "active" | "canceled" | "past_due"
      currentPeriodEnd: v.number(),
      discountPercentage: v.optional(v.number()), // Applied discount from referral
      discountExpiresAt: v.optional(v.number()), // When discount expires
    })
      .index("by_userId", ["userId"])
      .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;