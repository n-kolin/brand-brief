import { QuestionProps } from '@/app/types/question.type'

export default function TextQuestion({ question, value, onChange }: QuestionProps) {

  return (
    <div>
      <input
        value={value as string || ''}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </div>
  )
}
