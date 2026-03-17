import { buildQuestionsPrompt } from "@/app/lib/ai/prompts";
import { QuestionType } from "@/app/types/question.type";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        const { sectionTitle, answeredQuestions } = body as {
            sectionTitle: string;
            answeredQuestions: QuestionType[];
        };
        
        if (!sectionTitle || !answeredQuestions) {
            return NextResponse.json({ 
                success: false, 
                error: 'Missing sectionTitle or answeredQuestions',
                questions: {
                    shouldContinue: false,
                    questions: []
                }
            }, { status: 400 });
        }
        
        const prompt = buildQuestionsPrompt(sectionTitle, answeredQuestions);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text || '';
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if(!jsonMatch){
            console.error('No JSON found in AI response');
            throw new Error('No JSON found in the response');
        }
        
        const questionsData = JSON.parse(jsonMatch[0]);
        
        // בדיקה אם ה-AI החליט להפסיק
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
        })
    }
    catch(error){
        console.error('Error in generate-questions:', error);
        
        return NextResponse.json({ 
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            questions: {
                shouldContinue: false,
                questions: []
            }
        }, { status: 500 });
    }
}
