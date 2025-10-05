"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const analyzeCV = action({
  args: {
    analysisId: v.id("cvAnalyses"),
    extractedText: v.string(),
  },
  handler: async (ctx, args) => {
    // Call OpenRouter API for AI analysis
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `You are a career development AI assistant. Analyze this CV and provide a structured response in JSON format.

CV Text:
${args.extractedText}

Provide your analysis in this exact JSON structure:
{
  "skills": ["skill1", "skill2", ...],
  "experienceLevel": "Junior/Mid-Level/Senior",
  "missingSkills": ["skill1", "skill2", ...],
  "learningRoadmap": [
    {
      "week": 1,
      "skill": "Skill Name",
      "course": "Course Title",
      "platform": "Udemy/Coursera/LinkedIn Learning",
      "hours": 5,
      "link": "https://example.com/course"
    }
  ],
  "jobMatches": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "matchScore": 85,
      "salary": "$80,000 - $100,000",
      "location": "Remote/City"
    }
  ]
}

Focus on:
1. Extract 5-10 key technical and soft skills
2. Identify 3-5 trending skills they're missing for career growth
3. Create a 6-week learning roadmap with real courses
4. Suggest 3-5 job roles they could qualify for

Be specific, actionable, and motivating.`;

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
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response");
      }
      
      const analysis = JSON.parse(jsonMatch[0]);

      // Update the analysis with results
      await ctx.runMutation(internal.careersync.updateAnalysisResults, {
        analysisId: args.analysisId,
        skills: analysis.skills,
        experienceLevel: analysis.experienceLevel,
        missingSkills: analysis.missingSkills,
        learningRoadmap: analysis.learningRoadmap,
        jobMatches: analysis.jobMatches,
      });

      return { success: true };
    } catch (error) {
      console.error("AI Analysis error:", error);
      throw new Error("Failed to analyze CV");
    }
  },
});
