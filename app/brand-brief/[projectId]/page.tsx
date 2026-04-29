'use client'
import { AnswerType } from '@/app/types/question.type';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HistoryQuestionCard from '../components/HistoryQuestionCard';
import QuestionCard from '../components/QuestionCard';
import { Sections } from '@/app/config/sections.config';
import { useQuestions } from '@/app/context/QuestionContext';
import { generateQuestions, saveSection } from '@/app/lib/api';

const MAX_AI_ROUNDS = 3;

type AIStatus = 'idle' | 'fetching' | 'done';

export default function BrandBriefPage() {
    const { projectId, sections, currentSectionIndex, currentSection, addQuestions, updateAnswer, completeSection, goToPrevSection } = useQuestions();
    const router = useRouter();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [aiStatus, setAiStatus] = useState<AIStatus>('idle');

    // ref שמתעדכן בכל render - תמיד מחזיק את הערך הנוכחי גם בתוך closures
    const aiStatusRef = useRef<AIStatus>('idle');
    aiStatusRef.current = aiStatus;

    const roundsRef = useRef(0);
    const activeSectionIdRef = useRef(currentSection.sectionId);
    activeSectionIdRef.current = currentSection.sectionId;

    const questions = currentSection.questions;

    // ה-closing question מוצגת רק כשה-AI סיים לגמרי
    const canProceed = aiStatus === 'done';

    const tryGenerateMoreQuestions = async () => {
        // בודק aiStatusRef.current ולא aiStatus - כדי לקבל את הערך הנוכחי ולא מה-closure
        if (aiStatusRef.current === 'fetching' || aiStatusRef.current === 'done' || roundsRef.current >= MAX_AI_ROUNDS) return;

        const sectionIdAtStart = currentSection.sectionId;
        setAiStatus('fetching');

        try {
            const answeredQuestions = questions.filter(q => q.answer);
            const pendingQuestions = questions.filter(q => !q.answer && !q.isClosingQuestion);
            const data = await generateQuestions(currentSection.title, answeredQuestions, pendingQuestions);

            // section השתנה בזמן הקריאה - מתעלמים
            if (activeSectionIdRef.current !== sectionIdAtStart) return;

            if (!data.success) {
                setAiStatus('done');
                return;
            }

            if (data.questions?.shouldContinue === false) {
                setAiStatus('done');
                return;
            }

            if (data.questions?.questions?.length && data.questions.questions.length > 0) {
                addQuestions(data.questions.questions);
                roundsRef.current += 1;
            }

            if (roundsRef.current >= MAX_AI_ROUNDS) {
                setAiStatus('done');
            } else {
                setAiStatus('idle');
            }
        } catch (error) {
            console.error('Failed to generate questions:', error);
            setAiStatus('done');
        }
    };

    const handleAnswer = async (answer: AnswerType) => {
        updateAnswer(questions[currentQuestionIndex].id, answer);

        const isLastQuestion = currentQuestionIndex >= questions.length - 1;

        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const updatedQuestions = questions.map((q, i) =>
                i === currentQuestionIndex ? { ...q, answer } : q
            );
            await handleSectionComplete(updatedQuestions);
            return;
        }

        const questionsLeft = questions.length - currentQuestionIndex - 1;
        if (questionsLeft <= 3) {
            tryGenerateMoreQuestions();
        }

        // אם הגענו לשאלה לפני ה-closing ו-AI עדיין idle - מפעילים אותו
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
        completeSection();

        const isLast = currentSectionIndex === Sections.length - 1;
        if (isLast) {
            router.push(`/logo/${projectId}`);
        }
    };

    const handlePrevSection = () => {
        setCurrentQuestionIndex(0);
        setAiStatus('idle');
        roundsRef.current = 0;
        goToPrevSection();
    };

    const getInitialValue = () => {
        const q = questions[currentQuestionIndex];
        if (q.answer) return q.answer;
        if (q.defaultAnswer) return q.defaultAnswer;
        if (q.options) {
            if (q.type === 'CHECKBOX') return q.options.filter(o => o.default).map(o => o.key);
            const def = q.options.find(o => o.default);
            if (def) return def.key;
        }
        return q.type === 'CHECKBOX' ? [] : '';
    };

    const isLastSection = currentSectionIndex === Sections.length - 1;
    const isLastQuestion = currentQuestionIndex >= questions.length - 1;
    const currentQuestion = questions[currentQuestionIndex];

    // מפעיל AI כשמגיעים ל-closing question - בודק aiStatusRef.current לערך עדכני
    useEffect(() => {
        if (currentQuestion?.isClosingQuestion && aiStatusRef.current === 'idle') {
            tryGenerateMoreQuestions();
        }
    }, [currentQuestion?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const isWaitingForAI = currentQuestion?.isClosingQuestion && !canProceed;

    return (
        <div>
            <div>
                {sections.map((s, i) => (
                    <span key={s.sectionId} style={{ marginRight: 8, fontWeight: i === currentSectionIndex ? 'bold' : 'normal' }}>
                        {s.title} {s.completed ? '✓' : ''}
                    </span>
                ))}
            </div>

            <h1>{currentSection.title}</h1>

            {aiStatus === 'fetching' && <div>מכין שאלות נוספות...</div>}

            <div>
                {questions.slice(0, currentQuestionIndex).map(q => (
                    <HistoryQuestionCard key={q.id} question={q} />
                ))}
                {isWaitingForAI ? (
                    <div>ממתין לשאלות נוספות לפני הסיום...</div>
                ) : (
                    <QuestionCard
                        question={currentQuestion}
                        initialValue={getInitialValue()}
                        onAnswer={handleAnswer}
                    />
                )}
            </div>

            <div>
                <button onClick={handlePrevSection} disabled={currentSectionIndex === 0}>Previous</button>
                {isLastQuestion && isLastSection && canProceed && (
                    <button onClick={() => handleSectionComplete()}>Finish</button>
                )}
            </div>
        </div>
    );
}
