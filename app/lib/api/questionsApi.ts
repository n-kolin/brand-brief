import { QuestionType } from "@/app/types/question.type";
import { API_ENDPOINTS } from "./endpoints";

export interface GenerateQuestionsResponse {
  success: boolean;
  questions?: {
    shouldContinue: boolean;
    reason?: string;
    questions: QuestionType[];
  };
}

export async function generateQuestions(
  sectionTitle: string,
  answeredQuestions: QuestionType[]
): Promise<GenerateQuestionsResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.GENERATE_QUESTIONS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sectionTitle,
        answeredQuestions
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in generateQuestions:', error);
    return {
      success: false,
      questions: {
        shouldContinue: false,
        questions: []
      }
    };
  }
}
