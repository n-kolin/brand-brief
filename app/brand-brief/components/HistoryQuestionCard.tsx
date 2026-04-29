import { QuestionType } from '@/app/types/question.type'

function getDisplayAnswer(question: QuestionType): string {
    if (!question.answer) return 'No answer yet';

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

export default function HistoryQuestionCard({ question }: { question: QuestionType }) {
    return (
        <div>
            <h3>{question.question}</h3>
            <p>Answer: {getDisplayAnswer(question)}</p>
        </div>
    )
}
