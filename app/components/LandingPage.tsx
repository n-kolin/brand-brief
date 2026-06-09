'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/lib/api';
import { Sections, SECTION_ACCENT_CLASSES } from '@/app/config/sections.config';
import { ArrowLeft } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStart = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const projectId = await createProject();
            router.push(`/${projectId}`);
        } catch (err) {
            console.error('Error creating project:', err);
            setError('משהו השתבש, נסה שוב');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
                    <div className="absolute -bottom-40 right-1/3 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-4xl px-6 py-20">
                    {/* Logo */}
                    <div className="mb-12 flex justify-center">
                        <div className="flex items-center gap-1">
                            {Sections.map((section) => (
                                <div
                                    key={section.id}
                                    className={`h-3 w-3 rounded-full ${SECTION_ACCENT_CLASSES[section.id].bg}`}
                                />
                            ))}
                            <span className="mr-3 text-2xl font-bold text-foreground">BrandAI</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl text-balance">
                            בוא ניצור יחד את
                            <span className="block bg-gradient-to-l from-emerald-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                                המיתוג המושלם לעסק שלך
                            </span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground text-pretty">
                            תהליך פשוט של שאלות ותשובות שיעזור לנו להבין את העסק שלך, ובסוף נייצר לך לוגו ושפה עיצובית מותאמת אישית
                        </p>

                        {/* CTA Button */}
                        <button
                            onClick={handleStart}
                            disabled={isLoading}
                            className="group inline-flex items-center gap-3 rounded-2xl bg-foreground px-8 py-4 text-lg font-semibold text-background transition-all hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    <span>יוצר פרויקט...</span>
                                </>
                            ) : (
                                <>
                                    <span>בואו נתחיל</span>
                                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                </>
                            )}
                        </button>

                        {error && (
                            <p className="mt-4 text-sm text-rose-400">{error}</p>
                        )}
                    </div>

                    {/* Steps Preview */}
                    <div className="mt-20">
                        <h2 className="mb-8 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            5 שלבים פשוטים
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                            {Sections.map((section, index) => {
                                const colors = SECTION_ACCENT_CLASSES[section.id];
                                return (
                                    <div
                                        key={section.id}
                                        className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/50 p-6 transition-all hover:bg-card"
                                    >
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}>
                                            <span className="text-lg font-bold text-white">{index + 1}</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-foreground">{section.title}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-20 grid gap-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-border bg-card/50 p-6 text-center">
                            <div className="mb-3 text-2xl font-bold text-foreground">5 דקות</div>
                            <div className="text-sm text-muted-foreground">זמן ממוצע למילוי השאלון</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card/50 p-6 text-center">
                            <div className="mb-3 text-2xl font-bold text-foreground">AI מתקדם</div>
                            <div className="text-sm text-muted-foreground">יצירת לוגו בהתאמה אישית</div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card/50 p-6 text-center">
                            <div className="mb-3 text-2xl font-bold text-foreground">100% שלך</div>
                            <div className="text-sm text-muted-foreground">קבצים להורדה מיידית</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
