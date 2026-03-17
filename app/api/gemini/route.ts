import { QuestionType } from "@/app/types/question.type";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function GET(request: NextRequest, context: {params: {}}){
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works in a few words",
    });
    console.log(response);
    
    return NextResponse.json({
        text: response.text,
    })
}


export async function generateQuestions(answeredQuestions: any[]): Promise<QuestionType[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate follow-up questions based on these answers: ${JSON.stringify(answeredQuestions)}`,
      });
  
      const text = response.text || '{}';
      const generatedQuestions: QuestionType[] = JSON.parse(text);
  
      return generatedQuestions;
    } catch (error) {
      console.error("Error generating questions:", error);
      return [];
    }
  }

