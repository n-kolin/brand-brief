import { QuestionProps } from '@/app/types/question.type'
import { ChevronDown } from 'lucide-react'

export default function DropdownQuestion({ question, value, onChange }: QuestionProps) {
  return (
    <div className="relative w-full">
      <select
        value={value as string || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-border bg-secondary/50 px-4 py-3 pe-10 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
      >
        <option value="" disabled className="bg-card text-muted-foreground">
          בחר אפשרות
        </option>
        {question.options?.map((option) => (
          <option key={option.key} value={option.key} className="bg-card text-foreground">
            {option.value}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
