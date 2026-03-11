import { buildImagePrompt, buildQuestionsPrompt } from "@/app/lib/ai/prompts";
import { QuestionType } from "@/app/types/question.type";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: NextRequest) {

    try {
        const { allAnswers } = await request.json() as {
            allAnswers: Record<string, QuestionType[]>;
        }
        const prompt = buildImagePrompt(allAnswers);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return NextResponse.json({
                    success: true,
                    imageData: part.inlineData.data,
                    mimeType: part.inlineData.mimeType
                });
            }

            return NextResponse.json(
                { success: false, error: "No image generated" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate image" },
            { status: 500 }
        );
    }
}

// // צןדל נפרד שמיועד לתמונות
// // /app/api/imagen/generate-image/route.ts
// import { GoogleGenAI } from "@google/genai";
// import { NextRequest, NextResponse } from "next/server";

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function POST(request: NextRequest) {
//   try {
//     const { prompt } = await request.json();

//     const response = await ai.models.generateImages({
//       model: "imagen-4.0-generate-001",
//       prompt: prompt,
//       config: {
//         numberOfImages: 1,
//         aspectRatio: "1:1", // "1:1", "3:4", "4:3", "9:16", "16:9"
//       },
//     });

//     // מחזירים את התמונה הראשונה
//     const generatedImage = response.generatedImages?.[0];
//     if (generatedImage?.image?.imageBytes) {
//       return NextResponse.json({
//         success: true,
//         imageData: generatedImage.image.imageBytes,
//         mimeType: "image/png",
//       });
//     }

//     return NextResponse.json(
//       { success: false, error: "No image generated" },
//       { status: 500 }
//     );
//   } catch (error) {
//     console.error("Error generating image:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to generate image" },
//       { status: 500 }
//     );
//   }
// }