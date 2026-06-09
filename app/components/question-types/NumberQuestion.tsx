import { QuestionProps } from '@/app/types/question.type'

export default function NumberQuestion({ question, value, onChange }: QuestionProps) {
  return (
    <div className="w-full">
      <input
        type="number"
        value={value as number || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}
