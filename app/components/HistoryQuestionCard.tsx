import { QuestionType } from '@/app/types/question.type'
import { AccentClasses } from '@/app/config/sections.config'
import { Briefcase, Users, Palette, Paintbrush, FileText } from 'lucide-react'

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'business-info': Briefcase,
    'competition': Users,
    'existing-identity': Palette,
    'design-preferences': Paintbrush,
    'target-audience': FileText,
};

function getDisplayAnswer(question: QuestionType): string {
    if (!question.answer) return 'אין תשובה';
    if (question.options) {
        if (Array.isArray(question.answer)) {
            return (question.answer as string[])
                .map(key => question.options!.find(o => o.key === key)?.value || key)
                .join(', ');
        }
        return question.options.find(o => o.key === question.answer)?.value || question.answer as string;
    }
    return question.answer as string;
}

interface HistoryQuestionCardProps {
    question: QuestionType
    accent: AccentClasses
    sectionId: string
}

export default function HistoryQuestionCard({ question, accent, sectionId }: HistoryQuestionCardProps) {
    const SectionIcon = SECTION_ICONS[sectionId] || Briefcase;
    return (
        <div className="flex flex-col gap-2" style={{ direction: 'rtl' }}>
            {/* שורת שאלה: אייקון ימין, בועה שמאל */}
            <div className="flex items-start gap-2">
                {/* אייקון — ימין */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <SectionIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                {/* בועת שאלה — פינה עגולה-קטנה בימין (ליד האייקון) */}
                <div className="rounded-2xl rounded-tr-sm border border-border bg-card px-4 py-3 max-w-sm">
                    <p className="text-sm text-foreground leading-relaxed">{question.question}</p>
                </div>
            </div>
            {/* תשובת משתמש — מיושרת לימין (אחרי האייקון), פינה שמאלית-קטנה */}
            <div className="flex justify-start pr-9">
                <div className={`rounded-2xl rounded-tl-sm ${accent.bg} px-4 py-2.5 max-w-sm`}>
                    <p className="font-medium text-white text-sm leading-relaxed">{getDisplayAnswer(question)}</p>
                </div>
            </div>
        </div>
    )
}
