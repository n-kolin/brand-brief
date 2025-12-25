'use client'
import React, { useState } from 'react'
import QuestionCard from './components/QuestionCard'
import { AnswerType, QuestionType } from '../types/question.type'
import HistoryQuestionCard from './components/HistoryQuestionCard'
export default function page() {

    const initialQuestions: QuestionType[] = [
        {
            type: 'TEXT',
            id: 'q1',
            question: 'What is your name?',
            answer: '',
            defaultAnswer: 'שאלת טקסט ראונה',
        },
        {
            type: 'CHECKBOX',
            id: 'q2',
            question: 'אופציה 2 דיפולט',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2', default: true },
                { key: '3', value: 'option 3' },
                { key: '4', value: 'option 4', default: true },
                { key: '5', value: 'option 5', default: true },
                { key: '6', value: 'option 6' },
            ],
        },
        {
            type: 'TEXT',
            id: 'q3',
            question: 'אין דיפולט?',
            answer: '',
            defaultAnswer: '',
        },
        {
            type: 'DATE',
            id: 'q4',
            question: 'הדיפולט הוא 55555?',
            answer: '',
            defaultAnswer: '2026-01-01',
        },
        {
            type: 'DROPDOWN',
            id: 'q5',
            question: 'אין דיפולט',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2' },
                { key: '3', value: 'option 3', default: true },
            ],
        },
        {
            type: 'RADIO',
            id: 'q6',
            question: 'דיפולט 2',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2', default: true },
                { key: '3', value: 'option 3' },
            ],
        },

    ]

    const [questions, setQuestions] = useState<QuestionType[]>(initialQuestions);

    const handleAnswer = (answer: AnswerType, index: number) => {
        const updatedQuestions = [...questions];

        updatedQuestions[index] = {
            ...updatedQuestions[index],
            answer
        }
        setQuestions(updatedQuestions);
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    }

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const getInitialValue = () => {
        console.log('Getting initial value for question index:', questions);

        const q = questions[currentIndex];
        if (q.answer) return q.answer;

        if (q.defaultAnswer) return q.defaultAnswer;

        if (q.options) {
            if (q.type === 'CHECKBOX') {
                const defaults = q.options.filter(opt => opt.default).map(opt => opt.key);
                return defaults;
              } else {
                const defaultOption = q.options.find(opt => opt.default);
                if (defaultOption) return defaultOption.key;
              }
        }

        return q.type === 'CHECKBOX'? [] : '';
    }

    return (
        <div>
            <h1>Q & A</h1>
            <div>
                {
                    questions.slice(0, currentIndex).map((q, idx) => (
                        <HistoryQuestionCard key={q.id} question={q}></HistoryQuestionCard>
                    ))
                }
                <QuestionCard
                    question={questions[currentIndex]}
                    initialValue={getInitialValue()}
                    onAnswer={(answer: AnswerType) =>
                        handleAnswer(answer, currentIndex)
                    }
                />
                <h2>
                    Answer: {getInitialValue() as string || 'No answer yet'}
                </h2>
            </div>
        </div>
    )
}



