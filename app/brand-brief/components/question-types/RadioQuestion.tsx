import { QuestionProps } from '@/app/types/question.type'

export default function RadioQuestion({ question, value, onChange }: QuestionProps) {
    return (
        <div>
            {
                question.options?.map((option, index) => (
                    <div key={index}>
                        <input
                            type="radio"
                            id={`option-${index}`}
                            name={'radio-group'}
                            value={option.key}
                            checked={value === option.key}
                            onChange={() => onChange(option.key)}
                        />
                        <label htmlFor={`option-${index}`}>
                            {option.value}
                        </label>
                    </div>
                ))
            }
        </div>
    )
}
