import { QuestionProps } from '@/app/types/question.type'

export default function DropdownQuestion({ question, value, onChange }: QuestionProps) {
    return (
        <div>
            <select value={value as string || '' } onChange={(e) => onChange(e.target.value)}>
                <option value="" disabled>
                    Select an option
                </option>
                {question.options?.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.value}
                    </option>
                ))}
            </select>
        </div>
    )
}
