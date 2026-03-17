import { QuestionType } from "./question.type";

export type SessionData = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'in_progress' | 'completed';
  current_section: string | null;
  sections: Record<string, SectionData>;
  logo_url: string | null;
  logo_created_at: string | null;
}

export type SectionData = {
  questions: QuestionType[];
  completedAt?: string;
  aiGenerationRounds: number;
}

export type CreateSessionInput = {
  user_id: string;
  current_section: string;
  sections: Record<string, SectionData>;
}

export type UpdateSessionInput = Partial<Omit<SessionData, 'id' | 'created_at'>>;
