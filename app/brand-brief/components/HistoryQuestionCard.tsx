import { QuestionType } from '@/app/types/question.type'

export default function HistoryQuestionCard({ question }: { question: QuestionType }) {
    return (
        <div>
            <h3>{question.question}</h3>
            <p>Answer: {question.answer as string || 'No answer yet'}</p>
        </div>
    )
}
