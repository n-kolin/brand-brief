import { QuestionProps } from '@/app/types/question.type'

export default function DateQuestion({ question, value, onChange }: QuestionProps) {
    return (
        <div>
            <input
                type='date'
                value={value as string || ''}
                onChange={(e) => onChange(e.target.value)}
            ></input>
        </div>
    )
}
