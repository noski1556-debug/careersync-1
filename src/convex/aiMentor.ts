"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const chatWithMentor = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured. Please add it in the Integrations tab.");
    }

    // Try to fetch user context if authenticated
    let userContextString = "";
    try {
      // @ts-ignore - Suppress TS2589: Type instantiation is excessively deep
      const careerStats = await ctx.runQuery(api.careersync.getCareerIntelligence, {});
      
      if (careerStats) {
        userContextString = `
CURRENT USER CONTEXT (Use this to personalize advice):
- CV Rating/Profile Strength: ${careerStats.skillMatch}/100
- Projected Salary: €${careerStats.salaryProjection.projected.toLocaleString()}
- Top Missing Skills: ${careerStats.missingSkills.map((s: any) => s.name).join(", ")}
- Career Trend: ${careerStats.trendData.length > 1 ? "Improving" : "Stable"}
`;
      }
    } catch (err) {
      // User might not be authenticated or other error, ignore and proceed with generic advice
      console.log("Could not fetch user context for AI mentor:", err);
    }

    const systemPrompt = `You are an elite Career Strategy AI named "EvoluCoach". Your goal is to give high-impact, specific, and brutally honest career advice. You are NOT a generic support bot.

${userContextString}

STYLE GUIDELINES:
- Be concise and punchy. No fluff.
- Use bullet points and bold text for readability.
- If the user has a low CV rating (<60), be encouraging but urgent about improvements.
- If the user has missing skills, recommend specific projects or learning paths.
- Tone: Professional, energetic, and results-oriented. Like a top-tier career coach at a FAANG company.
- Max response length: 3 short paragraphs.

Your expertise:
- CV optimization (ATS beating strategies)
- Salary negotiation (getting top of band)
- Skill acquisition (fastest ROI)
- Interview prep (STAR method, behavioral questions)

If you don't have user context, ask them 1-2 specific questions to understand their seniority and field (e.g., "Are you a junior dev or looking to move into management?").`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: args.message,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      return { success: true, response: aiResponse };
    } catch (error) {
      console.error("AI Mentor chat error:", error);
      throw new Error(`Failed to get response from AI mentor: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});