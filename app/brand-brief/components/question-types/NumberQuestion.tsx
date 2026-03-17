import { QuestionProps } from '@/app/types/question.type'

export default function NumberQuestion({ question, value, onChange }: QuestionProps) {
    return (
        <div>
            <div>
                <input
                    type='number'
                    value={value as number || 0}
                    onChange={(e) => onChange(e.target.value)}
                ></input>
            </div>
        </div>
    )
}
