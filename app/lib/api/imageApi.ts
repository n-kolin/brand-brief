import { SectionState } from "@/app/context/QuestionContext";
import { QuestionType } from "@/app/types/question.type";
import { createClient } from "@/app/lib/supabase/client";
import { API_ENDPOINTS } from "./endpoints";

export interface GenerateImageResponse {
  success: boolean;
  imageData?: string;
  mimeType?: string;
  imagePrompt?: string;
  error?: string;
}

export interface SaveLogoResponse {
  success: boolean;
  logoUrl?: string;
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

  return response.json();
}

export async function uploadLogoToStorage(
  imageData: string,
  mimeType: string,
  userId: string,
  projectId: string
): Promise<SaveLogoResponse> {
  const supabase = createClient();

  const byteString = atob(imageData);
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });

  const ext = mimeType.split('/')[1] || 'png';
  const filePath = `${userId}/${projectId}/logo.${ext}`;

  const { error } = await supabase.storage
    .from('logos')
    .upload(filePath, blob, { upsert: true, contentType: mimeType });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
  return { success: true, logoUrl: data.publicUrl };
}

export async function saveLogoToProject(projectId: string, logoUrl: string, logoPrompt: string): Promise<void> {
  await fetch(API_ENDPOINTS.PROJECTS, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, logoUrl, logoPrompt }),
  });
}
