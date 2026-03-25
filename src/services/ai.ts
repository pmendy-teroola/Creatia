import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateMarketingContent(params: GenerationParams, brandProfile?: any) {
  const brandContext = brandProfile ? `
    Brand Name: ${brandProfile.brandName}
    Business Type: ${brandProfile.businessType}
    Target Audience: ${brandProfile.targetAudience}
    Tone: ${brandProfile.brandTone}
    Goal: ${brandProfile.brandGoal}
  ` : '';

  const prompt = `
    Generate a ${params.type} for the following business:
    Business Type: ${params.businessType}
    Target Audience: ${params.targetAudience}
    Tone: ${params.tone}
    Goal: ${params.goal}
    Language: ${params.language}
    Length: ${params.length}

    ${brandContext}

    Return a JSON object with:
    - title: A catchy title
    - content: The main body of the content
    - cta: A strong call to action
    - hashtags: An array of 5-10 relevant hashtags (if applicable)
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert marketing copywriter for entrepreneurs. 
      Your goal is to generate high-converting content based on the user's business and brand profile.
      CRITICAL: All generated text (title, content, cta, hashtags) MUST be in the language specified in the prompt (${params.language}).
      Always return the response in JSON format.`,
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Invalid AI response format");
  }
}

export async function generateWeeklyPlanner(brandProfile: any, language: string = 'English') {
  const prompt = `
    Generate a weekly content calendar for a business with the following profile:
    Brand Name: ${brandProfile.brandName}
    Business Type: ${brandProfile.businessType}
    Target Audience: ${brandProfile.targetAudience}
    Tone: ${brandProfile.brandTone}
    Language: ${language}

    Return a JSON array of 7 objects, one for each day of the week.
    Each object should have:
    - day: Day of the week (Monday, Tuesday, etc. in ${language})
    - type: Content type (Instagram, LinkedIn, Email, etc.)
    - topic: A brief topic or hook for the post
  `;

  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert content strategist. 
      Your goal is to create a high-level weekly content plan for an entrepreneur.
      CRITICAL: All generated text (day, topic, type) MUST be in ${language}.
      The plan should be returned in JSON format.`,
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(result.text || "[]");
  } catch (e) {
    console.error("Failed to parse weekly planner", e);
    return [];
  }
}
