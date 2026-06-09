import { QuestionProps } from '@/app/types/question.type'
import { Check } from 'lucide-react'

export default function RadioQuestion({ question, value, onChange, accent }: QuestionProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {question.options?.map((option) => {
        const isSelected = value === option.key
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`relative flex items-center gap-2 rounded-xl border px-4 py-3 transition-all ${
              isSelected
                ? accent
                  ? `${accent.border} ${accent.bgLight} ${accent.text}`
                  : 'border-accent bg-accent/20 text-accent'
                : 'border-border bg-secondary/50 text-foreground hover:bg-secondary'
            }`}
          >
            {isSelected && <Check className="h-4 w-4" />}
            <span>{option.value}</span>
          </button>
        )
      })}
    </div>
  )
}
