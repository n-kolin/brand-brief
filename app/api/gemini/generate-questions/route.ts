import { buildQuestionsPrompt } from "@/app/lib/ai/prompts";
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
        .eq('key', 'brand_question_generator_system_prompt')
        .single();

    if (error || !data?.content) {
        console.error('Failed to load system prompt from DB:', error?.message);
        throw new Error('System prompt not found in database');
    }

    return data.content;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sectionTitle, answeredQuestions, pendingQuestions } = body as {
            sectionTitle: string;
            answeredQuestions: QuestionType[];
            pendingQuestions?: QuestionType[];
        };

        if (!sectionTitle || !answeredQuestions) {
            return NextResponse.json({
                success: false,
                error: 'Missing sectionTitle or answeredQuestions',
                questions: { shouldContinue: false, questions: [] }
            }, { status: 400 });
        }

        const systemPrompt = await getSystemPrompt();
        const userPrompt = buildQuestionsPrompt(sectionTitle, answeredQuestions, pendingQuestions ?? []);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemPrompt,
            },
            contents: userPrompt,
        });

        const text = response.text || '';

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in the response');
        }

        const questionsData = JSON.parse(jsonMatch[0]);

        if (questionsData.shouldContinue === false) {
            return NextResponse.json({
                success: true,
                questions: {
                    shouldContinue: false,
                    reason: questionsData.reason || 'No more questions needed',
                    questions: []
                }
            });
        }

        return NextResponse.json({
            success: true,
            questions: {
                shouldContinue: true,
                questions: questionsData.questions || []
            }
        });

    } catch (error) {
        console.error('Error in generate-questions:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            questions: { shouldContinue: false, questions: [] }
        }, { status: 500 });
    }
}
