import { QuestionType } from "@/app/types/question.type";
import { API_ENDPOINTS } from "./endpoints";

export interface GenerateImageResponse {
  success: boolean;
  imageData?: string;
  mimeType?: string;
  error?: string;
}

export async function generateImage(
  allAnswers: Record<string, QuestionType[]>
): Promise<GenerateImageResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.GENERATE_IMAGE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allAnswers })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in generateImage API call:', error);
    return {
      success: false,
      error: 'Failed to generate image'
    };
  }
}
