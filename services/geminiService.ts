
import { GoogleGenAI } from "@google/genai";
import { Language } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFunFact = async (countryName: string, lang: Language): Promise<string> => {
  try {
    const langPrompt = lang === 'km' ? "in Khmer language" : "in English";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a single, very short, fascinating "Did you know?" fact about ${countryName} ${langPrompt}. Keep it under 15 words. No formatting like bolding or markdown. Return only the text.`,
    });
    return response.text?.trim() || (lang === 'km' ? "ប្រទេសដ៏គួរឱ្យចាប់អារម្មណ៍ដែលមានប្រវត្តិសាស្ត្រដ៏សម្បូរបែប!" : "A fascinating country with a rich history!");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'km' ? "ស្វែងយល់ពីពិភពលោកតាមរយៈទង់ជាតិ និងវប្បធម៌!" : "Explore the world through its flags and cultures!";
  }
};
