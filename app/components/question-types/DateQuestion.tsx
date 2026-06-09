import { QuestionProps } from '@/app/types/question.type'

export default function DateQuestion({ question, value, onChange }: QuestionProps) {
  return (
    <div className="w-full">
      <input
        type="date"
        value={value as string || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all [color-scheme:dark]"
      />
    </div>
  )
}
