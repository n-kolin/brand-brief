'use client'
import { AnswerType } from '@/app/types/question.type';
import React, { useState, useRef } from 'react';
import HistoryQuestionCard from '../components/HistoryQuestionCard';
import QuestionCard from '../components/QuestionCard';
import { Sections } from '@/app/config/sections.config';
import { useQuestions } from '@/app/context/QuestionContext';
import { generateQuestions, saveSection } from '@/app/lib/api';

const MAX_AI_GENERATION_ROUNDS = 3;

export default function BrandBriefPage() {
    const { projectId, sections, currentSectionIndex, currentSection, addQuestions, updateAnswer, completeSection, goToPrevSection } = useQuestions();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiStopped, setAiStopped] = useState(false);
    const isGeneratingRef = useRef(false);
    const generationRoundsRef = useRef(0);

    const questions = currentSection.questions;

    const tryGenerateMoreQuestions = async () => {
        if (isGeneratingRef.current || generationRoundsRef.current >= MAX_AI_GENERATION_ROUNDS || aiStopped) return;

        isGeneratingRef.current = true;
        setIsGenerating(true);

        try {
            const answeredQuestions = questions.filter(q => q.answer);
            const data = await generateQuestions(currentSection.title, answeredQuestions);

            if (!data.success) return;

            if (data.questions?.shouldContinue === false) {
                setAiStopped(true);
                return;
            }

            if (data.questions?.questions?.length > 0) {
                addQuestions(data.questions.questions);
                generationRoundsRef.current += 1;
            }
        } catch (error) {
            console.error('Failed to generate questions:', error);
        } finally {
            setIsGenerating(false);
            isGeneratingRef.current = false;
        }
    };

    const handleAnswer = async (answer: AnswerType) => {
        updateAnswer(questions[currentQuestionIndex].id, answer);

        const isLastQuestion = currentQuestionIndex >= questions.length - 1;

        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            await handleSectionComplete();
        }

        const questionsLeft = questions.length - currentQuestionIndex - 1;
        if (questionsLeft <= 2) {
            tryGenerateMoreQuestions();
        }
    };

    const handleSectionComplete = async () => {
        try {
            await saveSection(projectId, currentSection.sectionId, currentSection.title, questions);
        } catch (error) {
            console.error('Failed to save section:', error);
        }
        setCurrentQuestionIndex(0);
        setAiStopped(false);
        generationRoundsRef.current = 0;
        completeSection();
    };

    const handlePrevSection = () => {
        setCurrentQuestionIndex(0);
        setAiStopped(false);
        generationRoundsRef.current = 0;
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

            {isGenerating && <div>Generating more questions...</div>}

            <div>
                {questions.slice(0, currentQuestionIndex).map(q => (
                    <HistoryQuestionCard key={q.id} question={q} />
                ))}
                <QuestionCard
                    question={questions[currentQuestionIndex]}
                    initialValue={getInitialValue()}
                    onAnswer={handleAnswer}
                />
            </div>

            <div>
                <button onClick={handlePrevSection} disabled={currentSectionIndex === 0}>Previous</button>
                {isLastQuestion && isLastSection && (
                    <button onClick={handleSectionComplete}>Finish</button>
                )}
            </div>
        </div>
    );
}
