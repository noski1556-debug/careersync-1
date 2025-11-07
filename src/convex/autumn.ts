"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";

export const createCheckoutSession = action({
  args: {
    priceId: v.string(),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.AUTUMN_SECRET_KEY;
    
    if (!apiKey) {
      throw new Error("Autumn API key not configured. Please add it in the Integrations tab.");
    }

    // Get current user
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch("https://api.useautumn.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: userId.subject,
          price_id: args.priceId,
          success_url: args.successUrl,
          cancel_url: args.cancelUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Autumn API error: ${error}`);
      }

      const data = await response.json();
      return { checkoutUrl: data.url };
    } catch (error) {
      console.error("Checkout session error:", error);
      throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

export const handleWebhook = internalAction({
  args: {
    event: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    // Handle Autumn webhook events
    // Subscription management is handled separately
    // This webhook handler logs events for monitoring
    console.log("Autumn webhook event:", args.event);
    console.log("Event data:", JSON.stringify(args.data));
  },
});
