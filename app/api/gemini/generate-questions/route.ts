import { buildQuestionsPrompt } from "@/app/lib/ai/prompts";
import { QuestionType } from "@/app/types/question.type";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY || '' });

export async function POST(request: NextRequest){
    try{
        const { sectionTitle, answeredQuestions } = await request.json() as {
            sectionTitle: string;
            answeredQuestions: QuestionType[];
        }
        const prompt = buildQuestionsPrompt(sectionTitle, answeredQuestions);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if(!jsonMatch){
            throw new Error('No JSON found in the response');
        }
        const questionsData = JSON.parse(jsonMatch[0]);
        
        return NextResponse.json({ 
            success: true, 
            questions: questionsData 
        })
    }
    catch(error){
        console.error('Error generating questions:', error);
        return NextResponse.json({ 
            success: false, 
            questions: [] 
        }, { status: 500 });
    }
}

