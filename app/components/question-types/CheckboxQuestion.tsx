import { QuestionProps } from '@/app/types/question.type'
import { Check } from 'lucide-react'

export default function CheckboxQuestion({ question, value, onChange, accent }: QuestionProps) {
  const selectedKeys = (value as string[]) || []

  const handleToggle = (key: string) => {
    const newSelection = selectedKeys.includes(key)
      ? selectedKeys.filter(k => k !== key)
      : [...selectedKeys, key]
    onChange(newSelection)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {question.options?.map((option) => {
        const isSelected = selectedKeys.includes(option.key)
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => handleToggle(option.key)}
            className={`relative flex items-center gap-2 rounded-xl border px-4 py-3 transition-all ${
              isSelected
                ? accent
                  ? `${accent.border} ${accent.bgLight} ${accent.text}`
                  : 'border-accent bg-accent/20 text-accent'
                : 'border-border bg-secondary/50 text-foreground hover:bg-secondary'
            }`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                isSelected
                  ? accent
                    ? `${accent.border} ${accent.bg}`
                    : 'border-accent bg-accent'
                  : 'border-muted-foreground bg-transparent'
              }`}
            >
              {isSelected && <Check className="h-3 w-3 text-background" />}
            </div>
            <span>{option.value}</span>
          </button>
        )
      })}
    </div>
  )
}
