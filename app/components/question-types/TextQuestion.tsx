import { QuestionProps } from '@/app/types/question.type'

export default function TextQuestion({ question, value, onChange, accent }: QuestionProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value as string || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="הקלד כאן..."
        className={`w-full rounded-xl border bg-secondary/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
          accent
            ? `${accent.border} focus:${accent.ring}`
            : 'border-border focus:border-accent focus:ring-accent/20'
        }`}
      />
    </div>
  )
}
