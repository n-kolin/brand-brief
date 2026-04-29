import { buildLogoUserPrompt } from "@/app/lib/ai/prompts";
import { QuestionType } from "@/app/types/question.type";
import { createClient } from "@/app/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function getSystemPrompt(): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('prompts')
        .select('content')
        .eq('key', 'logo_prompt_generator_system_prompt')
        .single();

    if (error || !data?.content) {
        console.error('Failed to load system prompt from DB:', error?.message);
        throw new Error('System prompt not found in database');
    }

    return data.content;
}

export async function POST(request: NextRequest) {
    try {
        const { allAnswers } = await request.json() as {
            allAnswers: Record<string, QuestionType[]>;
        };

        const systemPrompt = await getSystemPrompt();
        const userPrompt = buildLogoUserPrompt(allAnswers);

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemPrompt,
            },
            contents: userPrompt,
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
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to generate image"
        }, { status: 500 });
    }
}
