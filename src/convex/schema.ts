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
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // CV Analysis storage
    cvAnalyses: defineTable({
      userId: v.id("users"),
      fileName: v.string(),
      fileStorageId: v.id("_storage"),
      extractedText: v.string(),
      status: v.string(), // "pending" | "completed" | "failed"
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
    }).index("by_userId", ["userId"]),

    // Subscriptions
    subscriptions: defineTable({
      userId: v.id("users"),
      stripeSubscriptionId: v.string(),
      stripePriceId: v.string(),
      status: v.string(), // "active" | "canceled" | "past_due"
      currentPeriodEnd: v.number(),
    })
      .index("by_userId", ["userId"])
      .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;