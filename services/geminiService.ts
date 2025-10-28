import { GoogleGenAI, Modality } from "@google/genai";

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY as per coding guidelines.
// This assumes the API key is always available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to remove base64 prefix
const stripBase64Prefix = (base64: string) => {
  return base64.split(',')[1] || base64;
}

export const generateImageWithPrompt = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const fullPrompt = `Carefully isolate the crochet product from the image and place it in a new, photorealistic setting: "${prompt}". Do not change the crochet product's shape, color, texture, or any details. The lighting on the product should realistically match the new background. The final image should be high quality.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: stripBase64Prefix(base64Image),
              mimeType: mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64ImageData = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64ImageData}`;
        }
    }

    return null;
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate image.");
  }
};