import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// Use "gemini-1.5-flash" - ensure your SDK is up to date (npm install @google/generative-ai)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define a schema to ensure the AI always returns the same JSON structure
const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview",
    generationConfig: {
        responseMimeType: "application/json",
    }
});

export const getResumeFeedback = async (resumeText: string, jobDescription: string) => {
  try {
    const prompt = `
      You are a professional technical recruiter. 
      Analyze the following Resume against the Job Description.
      
      Return a JSON object with exactly these keys:
      {
        "matchScore": number,
        "missingKeywords": string[],
        "improvements": string[]
      }

      Job Description: ${jobDescription}
      Resume: ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    
    // Safely handle the response to satisfy TypeScript
    if (!result || !result.response) {
        throw new Error("No response from Gemini API");
    }

    const response = result.response;
    const text = response.text();

    if (!text) {
        throw new Error("Empty text returned from Gemini");
    }

    return JSON.parse(text);
    
  } catch (error: any) {
    // Better error logging to see the actual status code and message
    console.error('Gemini Service Error:', error.status, error.message);
    throw new Error('Failed to generate feedback from Gemini');
  }
};