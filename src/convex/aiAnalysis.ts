"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const analyzeCV = action({
  args: {
    analysisId: v.id("cvAnalyses"),
    extractedText: v.string(),
    userLocation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Call OpenRouter API for AI analysis
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error("OpenRouter API key not configured");
      throw new Error("OpenRouter API key not configured. Please add it in the Integrations tab.");
    }

    const locationContext = args.userLocation 
      ? `\n\nUser Location: ${args.userLocation}\nIMPORTANT: Prioritize job recommendations in or near ${args.userLocation}. Include remote opportunities as well. Tailor salary ranges to the local market in ${args.userLocation}.`
      : "\n\nUser Location: Not specified\nProvide a mix of remote and general location job opportunities.";

    const prompt = `You are a career development AI assistant. Analyze this CV and provide a structured response in JSON format.

CV Text:
${args.extractedText}
${locationContext}

Provide your analysis in this exact JSON structure:
{
  "cvRating": 75,
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
0. Rate the CV quality from 0-100 based on completeness, formatting, clarity, achievements quantification, and professional presentation
1. Extract 5-10 key technical and soft skills
2. Identify 3-5 trending skills they're missing for career growth
3. Create a 6-week learning roadmap with real courses - IMPORTANT: Prioritize FREE courses from platforms like YouTube, freeCodeCamp, Coursera (audit mode), edX (audit mode), and other free resources. Only suggest paid courses if absolutely necessary for the skill.
4. Suggest 3-5 job roles they could qualify for${args.userLocation ? ` - PRIORITIZE jobs in or near ${args.userLocation}, include salary ranges appropriate for that location, and include remote opportunities` : ''}

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
        cvRating: analysis.cvRating,
        skills: analysis.skills,
        experienceLevel: analysis.experienceLevel,
        missingSkills: analysis.missingSkills,
        learningRoadmap: analysis.learningRoadmap,
        jobMatches: analysis.jobMatches,
      });

      return { success: true };
    } catch (error) {
      console.error("AI Analysis error:", error);
      throw new Error(`Failed to analyze CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});