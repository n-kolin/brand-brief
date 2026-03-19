import { QuestionType } from '@/app/types/question.type';
import { API_ENDPOINTS } from './endpoints';

export async function saveSection(
  projectId: string,
  sectionKey: string,
  sectionTitle: string,
  questions: QuestionType[]
): Promise<void> {
  const response = await fetch(API_ENDPOINTS.SECTIONS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, sectionKey, sectionTitle, questions }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to save section');
  }
}
