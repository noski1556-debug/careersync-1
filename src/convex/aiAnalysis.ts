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
    // Update progress: Extracting skills
    await ctx.runMutation(internal.careersync.updateProgressMessage, {
      analysisId: args.analysisId,
      status: "extracting_skills",
      progressMessage: "Extracting your skills and experience...",
    });

    // Call OpenRouter API for AI analysis
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error("OpenRouter API key not configured");
      throw new Error("OpenRouter API key not configured. Please add it in the Integrations tab.");
    }

    const locationContext = args.userLocation 
      ? `\n\nUser Location: ${args.userLocation}\nIMPORTANT: Prioritize job recommendations in or near ${args.userLocation}. Include remote opportunities as well. Tailor salary ranges to the local market in ${args.userLocation}.`
      : "\n\nUser Location: Not specified\nProvide a mix of remote and general location job opportunities.";

    const prompt = `You are an elite career development AI with expertise in CV evaluation, talent assessment, and career strategy. Your role is to provide BRUTALLY HONEST, data-driven analysis that pushes candidates to excellence.

CV Text:
${args.extractedText}
${locationContext}

Provide your analysis in this exact JSON structure:
{
  "cvRating": 45,
  "skills": ["skill1", "skill2", ...],
  "experienceLevel": "Junior/Mid-Level/Senior",
  "missingSkills": ["skill1", "skill2", ...],
  "learningRoadmap": [
    {
      "week": 1,
      "skill": "Skill Name",
      "course": "Course Title",
      "platform": "Platform Name",
      "hours": 5,
      "link": "https://example.com/course",
      "tips": "Key learning tips and best practices for mastering this skill",
      "practiceExercises": "Specific hands-on exercises to reinforce learning and build muscle memory"
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

CRITICAL EVALUATION CRITERIA:

0. CV RATING (0-100) - BE HARSH AND REALISTIC:
   - 90-100: Exceptional - Fortune 500 executive level, flawless presentation, quantified achievements, industry leadership
   - 80-89: Excellent - Senior professional, strong metrics, clear impact, minor improvements possible
   - 70-79: Good - Solid mid-level, decent structure, some quantification, needs more impact
   - 60-69: Average - Entry to mid-level, basic structure, lacks quantification, generic descriptions
   - 50-59: Below Average - Poor structure, no metrics, vague descriptions, formatting issues
   - 40-49: Weak - Major gaps, unprofessional presentation, no clear value proposition
   - 0-39: Unacceptable - Incomplete, unprofessional, would be rejected immediately

   Deduct points for:
   - Generic buzzwords without proof (-5 points each)
   - Lack of quantified achievements (-10 points)
   - Poor formatting or structure (-10 points)
   - Spelling/grammar errors (-5 points each)
   - Missing key sections (-10 points each)
   - Vague job descriptions (-5 points each)
   - No clear career progression (-10 points)
   - Outdated skills or technologies (-5 points)

1. SKILLS EXTRACTION (8-12 skills):
   - Identify ONLY skills explicitly mentioned or clearly demonstrated
   - Separate technical skills from soft skills
   - Note proficiency level based on context (beginner/intermediate/advanced)
   - Flag outdated or low-demand skills

2. MISSING CRITICAL SKILLS (5-8 skills):
   - Identify high-impact skills missing for their target role
   - Focus on trending, in-demand technologies and methodologies
   - Include both technical and strategic/leadership skills
   - Prioritize skills that would increase salary by 20%+

3. LEARNING ROADMAP (6 weeks):
   - IMPORTANT: Prioritize FREE courses: YouTube tutorials, freeCodeCamp, Coursera (audit mode), edX (audit mode), MIT OpenCourseWare, free Udemy courses
   - Only suggest paid courses if they're industry-recognized certifications (AWS, Google, etc.)
   - VERIFY TWICE: Only recommend courses that currently exist and are accessible. Double-check course URLs are valid.
   - Focus on skills with highest ROI
   - Include practical projects, not just theory
   - IMPORTANT: Provide REALISTIC time commitments based on actual course length (e.g., 3 hours for short tutorials, 8-15 hours for comprehensive courses, 20-40 hours for full bootcamp-style courses, 50+ hours for university-level courses)
   - Research the actual course duration and provide accurate hour estimates
   - Provide specific, actionable course links
   - For each course, include:
     * "tips": 2-3 key learning strategies specific to that skill (e.g., "Focus on building 3 real projects", "Practice daily for 30 minutes", "Join community forums for support")
     * "practiceExercises": Specific hands-on exercises to reinforce learning (e.g., "Build a todo app", "Solve 5 LeetCode problems daily", "Recreate popular website designs")

4. JOB MATCHES (8-12 roles):
   - CRITICAL: Recommend ONLY real, existing companies that are actively hiring
   - Use well-known companies in the industry (e.g., Google, Microsoft, Amazon, Meta, Apple, Netflix, Salesforce, Adobe, IBM, Oracle, etc.)
   - For startups, only mention companies you're confident exist (e.g., Stripe, Airbnb, Notion, Figma, etc.)
   - Be REALISTIC about qualification level
   - Match score should reflect actual competitiveness (most CVs are 60-75% matches)
   - Include stretch roles (80%+ match) and safe roles (90%+ match)
   ${args.userLocation ? `- PRIORITIZE jobs in or near ${args.userLocation} with location-specific salary data` : ''}
   - Provide accurate salary ranges based on experience level and location
   - Include both remote and local opportunities
   - CRITICAL: For EVERY job match, you MUST include the company's careers page URL in the "companyWebsite" field (e.g., "https://careers.google.com", "https://www.microsoft.com/careers", "https://www.amazon.jobs"). This is REQUIRED for all job matches.
   - IMPORTANT: Include company logo URL in the "companyLogo" field (NOT "logo") using Clearbit API format: https://logo.clearbit.com/[company-domain].com (e.g., https://logo.clearbit.com/google.com)
   - Job titles should be realistic and commonly used in the industry (e.g., "Software Engineer", "Senior Data Analyst", "Product Manager", not invented titles)
   - Example job match with working link: {"title": "Software Engineer", "company": "Google", "companyWebsite": "https://careers.google.com", "companyLogo": "https://logo.clearbit.com/google.com", "matchScore": 85, "salary": "$120,000 - $160,000", "location": "Remote"}

TONE: Professional but direct. Don't sugarcoat weaknesses. Provide constructive criticism that drives improvement. Most CVs are average (60-70 rating) - be honest about where this one stands.`;

    try {
      // Update progress: Analyzing experience
      await ctx.runMutation(internal.careersync.updateProgressMessage, {
        analysisId: args.analysisId,
        status: "analyzing_experience",
        progressMessage: "Analyzing your experience level and career trajectory...",
      });

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

      // Update progress: Generating roadmap
      await ctx.runMutation(internal.careersync.updateProgressMessage, {
        analysisId: args.analysisId,
        status: "generating_roadmap",
        progressMessage: "Creating your personalized learning roadmap...",
      });

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
      
      // Update status to failed
      await ctx.runMutation(internal.careersync.updateProgressMessage, {
        analysisId: args.analysisId,
        status: "failed",
        progressMessage: "Analysis failed. Please try again.",
      });
      
      throw new Error(`Failed to analyze CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});