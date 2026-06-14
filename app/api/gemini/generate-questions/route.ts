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
        .limit(1)
        .single();

    if (error || !data?.content) {
        console.error('Failed to load system prompt from DB:', error?.code, error?.message, '| data:', JSON.stringify(data));
        throw new Error('System prompt not found in database');
    }

    return data.content;
}

export async function POST(request: NextRequest) {
    try {
        // auth check — מונע שימוש ב-Gemini API ללא אימות
        const supabaseAuth = await createClient();
        const { data: { user } } = await supabaseAuth.auth.getUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

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
        console.log('✅ System prompt loaded from DB successfully');
        const userPrompt = buildQuestionsPrompt(sectionTitle, answeredQuestions, pendingQuestions ?? []);

        console.log('🚀 Calling Gemini API...');
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

        const timestamp = Date.now();
        const questionsWithIds = (questionsData.questions || []).map((q: QuestionType, i: number) => ({
            ...q,
            id: q.id || `ai_q_${timestamp}_${i}_${Math.random().toString(36).slice(2, 7)}`,
        }));

        return NextResponse.json({
            success: true,
            questions: {
                shouldContinue: true,
                questions: questionsWithIds
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
