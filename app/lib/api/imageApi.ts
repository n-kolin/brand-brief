import { SectionState } from "@/app/context/QuestionContext";
import { QuestionType } from "@/app/types/question.type";
import { API_ENDPOINTS } from "./endpoints";

export interface GenerateImageResponse {
  success: boolean;
  imageData?: string;
  mimeType?: string;
  imagePrompt?: string;
  error?: string;
}

export async function generateImage(sections: SectionState[]): Promise<GenerateImageResponse> {
  const allAnswers: Record<string, QuestionType[]> = {};
  for (const section of sections) {
    allAnswers[section.title] = section.questions;
  }

  const response = await fetch(API_ENDPOINTS.GENERATE_IMAGE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ allAnswers }),
  });

  const data = await response.json();
  return data;
}
