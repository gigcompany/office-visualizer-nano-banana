import { GoogleGenAI,GenerateContentResponse } from '@google/genai';

export async function generate3DRender({ theme, brandColor, floorMaterial, wallMaterial, image }) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API key not found. Please set the REACT_APP_GEMINI_API_KEY environment variable.");
  }


  const genAI = new GoogleGenAI({ apiKey: apiKey });

  const prompt = 
      `
      **Role:**
      You are am expert 3D office space designer. Your task to create a perfect 3D render of the office space based on the inputs given.
      
      **Task:**
      Create a 3D render of an office based on the following user choices and the provided 2D floor plan. 
      
      The user has made the following choices for the design of their office:
      - Theme: ${theme}
      - Floor Material: ${floorMaterial}
      - Wall Material: ${wallMaterial}

      If theme is modern, use the latest design trends to create a 3D render of the office space. Use white color laminate for the table tops.
      If theme is vibrant, use vibrant colors and latest design principles to create a 3D render of the office space. Use light wood laminate for the table tops.
      If theme is minimalist, use minimalist design principles to create a 3D render of the office space. Use white color laminate for the table tops.
      If theme is industrial, use industrial design principles to create a 3D render of the office space. Use white color laminate for the table tops.

      If floor material is carpet, use grey hatch pattern to generage the floor of the 3D render of the entire office space. The carpet color for the passage and the seating area should be using different shades and patterns. If industrial theme is choosen then make the carpet a darker shade of grey.
      If floor material is wood, use walnut wood texture to generate the floor of the passages in the 3D render of the office space. Use grey hatch carpet patter for the floor space under the seating and rooms.
      If floor material is tiles, use marble square tiles design principles to generate the floor of the 3D render of the office space. Use grey hatch carpet patter for the floor space under the seating and rooms.

      If wall material is paint, use paint color ${brandColor} to create the outer walls of the 3D render of the office space.
      If wall material is bricks, use red bricks to design the outer walls of the 3D render of the office space.
      If wall material is glass, use transparent glass to design the inner walls of the 3D render of the office space.

      Based on these choices and the floor plan, generate a 3D render image of the office. Do not create a photorealistic photo yet.
      
      ** IMPORTANT **
      In all cases the inner walls will always be glass. Add potted plants that align with the theme of the office. 
      If the 2D floor plan has collaboration areas then add soft furnishings that match the theme of the office.
      Preserve the dimensions of the original image
      Retain the labels (if any) of the original image
      Use modern hybraulic chairs with headrest for the seating
      Ignore any floor colors that you see in the 2D floor plan. 
      `;

  try {
    const textPart = { text: prompt };
    const imagePart = { inlineData: { mimeType: image.type, data: image.data }};
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, textPart] }, // IMPORTANT: Use clean image
    });
    // const response = await genAI.getGenerativeModel({ model: "gemini-1.5-flash-image-preview"}).generateContent({ contents: prompt });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return "No image data generated.";
  } catch (error) {
    console.error("Error generating 3D render:", error);
    throw new Error("An error occurred while generating the 3D render. Please check the console for more details.");
  }
}

export async function generatePhotorealisticImage({ image, prompt }) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API key not found. Please set the REACT_APP_GEMINI_API_KEY environment variable.");
  }

  const genAI = new GoogleGenAI({ apiKey: apiKey });

  try {
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: image } }; // Assuming image is base64 jpeg
    const textPart = { text: prompt };

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, textPart] },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return "No image data generated.";
  } catch (error) {
    console.error("Error generating photorealistic image:", error);
    throw new Error("An error occurred while generating the photorealistic image. Please check the console for more details.");
  }
}
