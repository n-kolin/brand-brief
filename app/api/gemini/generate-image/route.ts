import { buildLogoPromptGeneratorPrompt } from "@/app/lib/ai/prompts";
import { QuestionType } from "@/app/types/question.type";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: NextRequest) {
    try {
        const { allAnswers } = await request.json() as {
            allAnswers: Record<string, QuestionType[]>;
        };

        const promptGeneratorPrompt = buildLogoPromptGeneratorPrompt(allAnswers);
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promptGeneratorPrompt,
        });

        const imagePrompt = textResponse.text?.trim();
        if (!imagePrompt) {
            return NextResponse.json({ success: false, error: "Failed to generate image prompt" }, { status: 500 });
        }

        const imageResponse = await ai.models.generateContent({
            model: "gemini-3.1-flash-image-preview",
            contents: imagePrompt,
            config: {
                responseModalities: ["IMAGE", "TEXT"],
            },
        });

        const parts = imageResponse.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find(p => p.inlineData);

        if (!imagePart?.inlineData) {
            return NextResponse.json({ success: false, error: "No image generated" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            imageData: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType,
            imagePrompt,
        });

    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json({ success: false, error: "Failed to generate image" }, { status: 500 });
    }
}
