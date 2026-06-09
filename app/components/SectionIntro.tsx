// PATH: app/brand-brief/components/SectionIntro.tsx
'use client'
import { useEffect } from 'react'
import { SectionState } from '@/app/context/QuestionContext'
import { AccentClasses, Sections, SECTION_ACCENT_CLASSES } from '@/app/config/sections.config'
import { Briefcase, Users, Palette, Paintbrush, FileText } from 'lucide-react'

interface SectionIntroProps {
    section: SectionState
    accent: AccentClasses
    sectionIndex: number
    totalSections: number
    onStart: () => void
}

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'business-info': Briefcase,
    'competition': Users,
    'existing-identity': Palette,
    'design-preferences': Paintbrush,
    'target-audience': FileText,
}

const SECTION_LABELS: Record<string, string> = {
    'business-info':      'העסק שלך',
    'competition':        'התחרות שלך',
    'existing-identity':  'הזהות שלך',
    'design-preferences': 'הפלטה שלך',
    'target-audience':    'הקהל שלך',
}

export default function SectionIntro({
    section,
    accent,
    sectionIndex,
    onStart,
}: Omit<SectionIntroProps, 'totalSections'> & { totalSections?: number }) {
    useEffect(() => {
        const timer = setTimeout(onStart, 1500)
        return () => clearTimeout(timer)
    }, [onStart])

    const SectionIcon = SECTION_ICONS[section.sectionId] || Briefcase
    const label = SECTION_LABELS[section.sectionId] || section.title

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-center">
                {/* Icon — outline style */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
                    <SectionIcon className="h-7 w-7 text-foreground" />
                </div>

                {/* Subtitle */}
                <p className="text-sm text-muted-foreground">{label}</p>

                {/* Title */}
                <h1 className={`text-5xl font-bold ${accent.text}`}>
                    {section.title}
                </h1>

                {/* Dots Progress */}
                <div className="mt-4 flex items-center gap-2" style={{ direction: 'rtl' }}>
                    {Sections.map((s, i) => {
                        const dotAccent = SECTION_ACCENT_CLASSES[s.id]
                        const isActive = i === sectionIndex
                        const isPast = i < sectionIndex
                        return (
                            <div
                                key={s.id}
                                className={`rounded-full transition-all ${
                                    isActive
                                        ? `h-2.5 w-6 ${dotAccent.bg}`
                                        : isPast
                                        ? `h-2.5 w-2.5 ${dotAccent.bg} opacity-60`
                                        : 'h-2.5 w-2.5 bg-secondary'
                                }`}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
