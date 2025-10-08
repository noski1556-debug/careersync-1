"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const chatWithMentor = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured. Please add it in the Integrations tab.");
    }

    const systemPrompt = `You are an experienced and friendly AI Career Mentor. Your role is to provide actionable, personalized career advice to professionals at all levels.

Your expertise includes:
- CV/Resume optimization and improvement strategies
- Job search strategies and job matching based on skills
- Skill development and learning roadmaps
- Career transitions and pivots
- Salary negotiation tactics
- Interview preparation
- Professional networking
- Work-life balance and career growth

Communication style:
- Be warm, encouraging, and supportive
- Provide specific, actionable advice (not generic platitudes)
- Use relevant emojis occasionally to add personality
- Keep responses concise but comprehensive (2-4 paragraphs max)
- Ask clarifying questions when needed
- Reference real-world examples when helpful
- Be honest about challenges but always solution-oriented

Remember: You're a mentor, not just an information source. Guide users toward their career goals with empathy and expertise.`;

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
