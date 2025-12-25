'use client'
import { AnswerType, QuestionType } from '@/app/types/question.type'
import React, { useEffect, useState } from 'react'
import RadioQuestion from './question-types/RadioQuestion'
import TextQuestion from './question-types/TextQuestion'
import CheckboxQuestion from './question-types/CheckboxQuestion'
import DropdownQuestion from './question-types/DropdownQuestion'
import NumberQuestion from './question-types/NumberQuestion'
import DateQuestion from './question-types/DateQuestion'

export default function QuestionCard({ question, initialValue, onAnswer }: { question: QuestionType, initialValue: AnswerType, onAnswer: (answer: AnswerType) => void }) {

    const [currentAnswer, setCurrentAnswer] = useState<AnswerType>(
        initialValue || (question.type === 'CHECKBOX' ? [] : '')
    );

    const QUESTION_COMPONENT = {
        TEXT: TextQuestion,
        RADIO: RadioQuestion,
        CHECKBOX: CheckboxQuestion,
        DROPDOWN: DropdownQuestion,
        NUMBER: NumberQuestion,
        DATE: DateQuestion,
    }
    const Component = QUESTION_COMPONENT[question.type];

    useEffect(() => {
        const newValue = initialValue;
        setCurrentAnswer(newValue);
    }, [question.id]);

    return (
        <div>
            <h2>{question.question}</h2>
            <div>
                <Component
                    question={question}
                    value={currentAnswer}
                    onChange={setCurrentAnswer}
                />
                <button onClick={() => onAnswer(currentAnswer)}>OK</button>
            </div>
        </div>
    )
}
