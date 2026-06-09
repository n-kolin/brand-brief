//ProjectPage
'use client'
import { AnswerType, QuestionType } from '@/app/types/question.type';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HistoryQuestionCard from '@/app/components/HistoryQuestionCard';
import { Sections, SECTION_ACCENT_CLASSES, AccentClasses } from '@/app/config/sections.config';
import { useQuestions } from '@/app/context/QuestionContext';
import { generateQuestions, saveSection } from '@/app/lib/api';
import { Briefcase, Users, Palette, Paintbrush, FileText, ArrowLeft } from 'lucide-react';
import SectionIntro from '@/app/components/SectionIntro';

const MAX_AI_ROUNDS = 3;

type AIStatus = 'idle' | 'fetching' | 'done';
type PageMode = 'intro' | 'questions';

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'business-info': Briefcase,
    'competition': Users,
    'existing-identity': Palette,
    'design-preferences': Paintbrush,
    'target-audience': FileText,
};

// אנימציית 3 נקודות
function TypingIndicator({ accent, SectionIcon }: { accent: AccentClasses; SectionIcon: React.ComponentType<{ className?: string }> }) {
    return (
        <div className="flex items-start gap-2" style={{ direction: 'rtl' }}>
            {/* אייקון — ימין */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <SectionIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            {/* בועה — פינה עגולה-קטנה בימין-עליון (ליד האייקון) */}
            <div className="rounded-2xl rounded-tr-sm border border-border bg-card px-4 py-3">
                <div className="flex items-center gap-1">
                    <div className={`h-1.5 w-1.5 rounded-full ${accent.bg} animate-bounce`} style={{ animationDelay: '0ms' }} />
                    <div className={`h-1.5 w-1.5 rounded-full ${accent.bg} animate-bounce`} style={{ animationDelay: '150ms' }} />
                    <div className={`h-1.5 w-1.5 rounded-full ${accent.bg} animate-bounce`} style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}

// אפשרויות בחירה (RADIO / CHECKBOX) — מוצגות מתחת לבועה
function SelectOptions({ question, value, onChange, accent }: {
    question: QuestionType;
    value: AnswerType;
    onChange: (v: AnswerType) => void;
    accent: AccentClasses;
}) {
    const isCheckbox = question.type === 'CHECKBOX';
    const selectedValues = isCheckbox ? (value as string[] || []) : [value as string];

    const handleSelect = (key: string) => {
        if (isCheckbox) {
            const current = value as string[] || [];
            onChange(current.includes(key) ? current.filter(k => k !== key) : [...current, key]);
        } else {
            onChange(key);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 mt-3" style={{ direction: 'rtl' }}>
            {question.options?.map((option) => {
                const isSelected = selectedValues.includes(option.key);
                return (
                    <button
                        key={option.key}
                        type="button"
                        onClick={() => handleSelect(option.key)}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                            isSelected
                                ? `${accent.bg} text-white border-transparent`
                                : 'border-border bg-transparent text-foreground hover:bg-secondary'
                        }`}
                    >
                        {option.value}
                    </button>
                );
            })}
        </div>
    );
}

// שדה טקסט — מוצג בפוטר
function TextInput({ value, onChange, onSubmit, accent, placeholder, focusTrigger }: {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    accent: AccentClasses;
    placeholder?: string;
    focusTrigger?: number;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // פוקוס אוטומטי כשמופיעה שאלה חדשה
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [focusTrigger]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'הקלד את התשובה שלך...'}
            dir="rtl"
            rows={1}
            className={`w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-all resize-none overflow-hidden ${accent.border} ${accent.ring}`}
            style={{ minHeight: '48px', maxHeight: '120px' }}
            onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
            }}
        />
    );
}

export default function ProjectPage() {
    const { projectId, sections, currentSectionIndex, currentSection, addQuestions, updateAnswer, completeSection } = useQuestions();
    const router = useRouter();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
    const [currentAnswer, setCurrentAnswer] = useState<AnswerType>('');
    const [pageMode, setPageMode] = useState<PageMode>('intro');
    const [isTyping, setIsTyping] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const aiStatusRef = useRef<AIStatus>('idle');
    aiStatusRef.current = aiStatus;
    const roundsRef = useRef(0);
    const activeSectionIdRef = useRef(currentSection.sectionId);
    activeSectionIdRef.current = currentSection.sectionId;

    const questions = currentSection.questions;
    const currentQuestion = questions[currentQuestionIndex];
    const canProceed = aiStatus === 'done';
    const accent = SECTION_ACCENT_CLASSES[currentSection.sectionId];
    const SectionIcon = SECTION_ICONS[currentSection.sectionId] || Briefcase;
    const hasOptions = !!(currentQuestion?.options && currentQuestion.options.length > 0);

    // אנימציית typing כשמשתנה שאלה
    useEffect(() => {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 1000);
        return () => clearTimeout(timer);
    }, [currentQuestionIndex]);

    // עדכון תשובה נוכחית
    useEffect(() => {
        const q = questions[currentQuestionIndex];
        if (!q) return;
        if (q.answer) {
            setCurrentAnswer(q.answer);
        } else if (q.defaultAnswer) {
            setCurrentAnswer(q.defaultAnswer);
        } else if (q.options) {
            if (q.type === 'CHECKBOX') {
                setCurrentAnswer(q.options.filter(o => o.default).map(o => o.key));
            } else {
                const def = q.options.find(o => o.default);
                setCurrentAnswer(def ? def.key : '');
            }
        } else {
            setCurrentAnswer(q.type === 'CHECKBOX' ? [] : '');
        }
    }, [currentQuestionIndex, questions]);

    // Auto-scroll — מופעל גם כשנוספות שאלות חדשות מה-AI
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [currentQuestionIndex, isTyping, questions.length]);

    // הפעלת AI כשמגיעים ל-closing question
    useEffect(() => {
        if (currentQuestion?.isClosingQuestion && aiStatusRef.current === 'idle') {
            tryGenerateMoreQuestions();
        }
    }, [currentQuestion?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const tryGenerateMoreQuestions = async () => {
        if (aiStatusRef.current === 'fetching' || aiStatusRef.current === 'done' || roundsRef.current >= MAX_AI_ROUNDS) return;

        const sectionIdAtStart = currentSection.sectionId;
        setAiStatus('fetching');

        try {
            const answeredQuestions = questions.filter(q => q.answer);
            const pendingQuestions = questions.filter(q => !q.answer && !q.isClosingQuestion);
            const data = await generateQuestions(currentSection.title, answeredQuestions, pendingQuestions);

            if (activeSectionIdRef.current !== sectionIdAtStart) return;

            if (!data.success || data.questions?.shouldContinue === false) {
                setAiStatus('done');
                return;
            }

            if (data.questions?.questions?.length && data.questions.questions.length > 0) {
                addQuestions(data.questions.questions);
                roundsRef.current += 1;
            }

            setAiStatus(roundsRef.current >= MAX_AI_ROUNDS ? 'done' : 'idle');
        } catch (error) {
            console.error('Failed to generate questions:', error);
            setAiStatus('done');
        }
    };

    const handleSubmit = async () => {
        if (!isAnswerValid()) return;
        updateAnswer(questions[currentQuestionIndex].id, currentAnswer);

        const isLastQuestion = currentQuestionIndex >= questions.length - 1;

        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const updatedQuestions = questions.map((q, i) =>
                i === currentQuestionIndex ? { ...q, answer: currentAnswer } : q
            );
            await handleSectionComplete(updatedQuestions);
            return;
        }

        const questionsLeft = questions.length - currentQuestionIndex - 1;
        if (questionsLeft <= 3) tryGenerateMoreQuestions();

        const nextQuestion = questions[currentQuestionIndex + 1];
        if (nextQuestion?.isClosingQuestion && aiStatusRef.current === 'idle') {
            tryGenerateMoreQuestions();
        }
    };

    const handleSectionComplete = async (updatedQuestions = questions) => {
        try {
            await saveSection(projectId, currentSection.sectionId, currentSection.title, updatedQuestions);
        } catch (error) {
            console.error('Failed to save section:', error);
        }
        setCurrentQuestionIndex(0);
        setAiStatus('idle');
        roundsRef.current = 0;
        setPageMode('intro');
        completeSection();

        if (currentSectionIndex === Sections.length - 1) {
            router.push(`/logo/${projectId}`);
        }
    };

    const isAnswerValid = () => {
        if (!currentQuestion) return false;
        if (currentQuestion.type === 'CHECKBOX') {
            return Array.isArray(currentAnswer) && currentAnswer.length > 0;
        }
        return currentAnswer !== '' && currentAnswer !== null && currentAnswer !== undefined;
    };

    const isWaitingForAI = currentQuestion?.isClosingQuestion && !canProceed;

    if (pageMode === 'intro') {
        return (
            <SectionIntro
                section={currentSection}
                accent={accent}
                sectionIndex={currentSectionIndex}
                totalSections={Sections.length}
                onStart={() => setPageMode('questions')}
            />
        );
    }

    return (
        <div className="flex h-screen flex-col bg-background overflow-hidden">
            {/* Header — נשאר קבוע בראש */}
            <header className="border-b border-border bg-background shrink-0">
                <div className="mx-auto max-w-2xl px-4 py-3">
                    {/* flex עם dir="rtl" — ימין: אייקון+כותרת, שמאל: dots */}
                    <div className="flex items-center justify-between" style={{ direction: 'rtl' }}>
                        {/* אייקון + כותרת — ימין */}
                        <div className="flex items-center gap-2">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent.bg}`}>
                                <SectionIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-foreground leading-tight">{currentSection.title}</h1>
                                <p className="text-xs text-muted-foreground">בואו נכיר</p>
                            </div>
                        </div>

                        {/* Section dots — ימין לשמאל, ירוק בימין */}
                        <div className="flex items-center gap-1.5" style={{ direction: 'rtl' }}>
                            {sections.map((s, i) => {
                                const dotAccent = SECTION_ACCENT_CLASSES[s.sectionId];
                                const isActive = i === currentSectionIndex;
                                const isPast = i < currentSectionIndex;
                                return (
                                    <div
                                        key={s.sectionId}
                                        className={`rounded-full transition-all ${
                                            isActive
                                                ? `h-3 w-6 ${dotAccent.bg}`
                                                : isPast
                                                ? `h-2.5 w-2.5 ${dotAccent.bg}`
                                                : 'h-2.5 w-2.5 bg-secondary'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                            className={`h-full transition-all duration-500 ${accent.bg}`}
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            </header>

            {/* Chat Area — גלילה רק פה, header ו-footer קבועים */}
            <main ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
                <div className="mx-auto max-w-2xl px-4 py-6">
                    <div className="flex flex-col gap-4">
                        {/* שאלות קודמות */}
                        {questions.slice(0, currentQuestionIndex).map(q => (
                            <HistoryQuestionCard key={q.id} question={q} accent={accent} sectionId={currentSection.sectionId} />
                        ))}

                        {/* ממתין ל-AI (closing question) */}
                        {isWaitingForAI && (
                            <TypingIndicator accent={accent} SectionIcon={SectionIcon} />
                        )}

                        {/* אנימציית typing OR שאלה נוכחית */}
                        {!isWaitingForAI && (
                            isTyping ? (
                                <TypingIndicator accent={accent} SectionIcon={SectionIcon} />
                            ) : currentQuestion && (
                                <div className="flex flex-col gap-2" style={{ direction: 'rtl' }}>
                                    {/* שורת אייקון + בועת שאלה */}
                                    <div className="flex items-start gap-2">
                                        {/* אייקון — ימין */}
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                                            <SectionIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                        {/* בועה — פינה עגולה-קטנה בימין-עליון (ליד האייקון) */}
                                        <div className="rounded-2xl rounded-tr-sm border border-border bg-card px-4 py-3 max-w-sm">
                                            <p className="text-sm text-foreground leading-relaxed">{currentQuestion.question}</p>
                                        </div>
                                    </div>
                                    {/* אפשרויות בחירה — מתחת, מיושרות לשמאל (צד הבועה) */}
                                    {hasOptions && (
                                        <div className="pr-9">
                                            <SelectOptions
                                                question={currentQuestion}
                                                value={currentAnswer}
                                                onChange={setCurrentAnswer}
                                                accent={accent}
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>

            {/* Footer — קבוע בתחתית תמיד */}
            <footer className="border-t border-border bg-background shrink-0">
                <div className="mx-auto max-w-2xl px-4 py-3">
                    <div className="flex flex-col gap-2">
                        {/* שדה טקסט — רק לשאלות טקסט, לא בזמן typing/waiting */}
                        {!isTyping && !isWaitingForAI && currentQuestion && !hasOptions && (
                            <TextInput
                                value={currentAnswer as string}
                                onChange={(v) => setCurrentAnswer(v)}
                                onSubmit={handleSubmit}
                                accent={accent}
                                placeholder="ספר לנו... (אפשר לדלג)"
                                focusTrigger={currentQuestionIndex}
                            />
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={!(!isTyping && !isWaitingForAI && currentQuestion && isAnswerValid())}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all ${
                                (!isTyping && !isWaitingForAI && currentQuestion && isAnswerValid())
                                    ? `${accent.bg} text-white hover:opacity-90`
                                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                            }`}
                        >
                            <span>הבא</span>
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
