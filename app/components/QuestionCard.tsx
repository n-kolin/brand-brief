//QuestionCard.tsx
'use client'
import { AnswerType, QuestionType } from '@/app/types/question.type'
import React, { useEffect, useState } from 'react'
import RadioQuestion from './question-types/RadioQuestion'
import TextQuestion from './question-types/TextQuestion'
import CheckboxQuestion from './question-types/CheckboxQuestion'
import DropdownQuestion from './question-types/DropdownQuestion'
import NumberQuestion from './question-types/NumberQuestion'
import DateQuestion from './question-types/DateQuestion'
import { ArrowLeft } from 'lucide-react'
import { AccentClasses } from '@/app/config/sections.config'

const QUESTION_COMPONENT = {
    TEXT: TextQuestion,
    RADIO: RadioQuestion,
    CHECKBOX: CheckboxQuestion,
    DROPDOWN: DropdownQuestion,
    NUMBER: NumberQuestion,
    DATE: DateQuestion,
}

const isAnswerValid = (question: QuestionType, answer: AnswerType): boolean => {
    if (question.type === 'CHECKBOX') {
        return Array.isArray(answer) && answer.length > 0
    }
    return answer !== '' && answer !== null && answer !== undefined
}

export default function QuestionCard({
    question,
    initialValue,
    onAnswer,
    accent,
}: {
    question: QuestionType
    initialValue: AnswerType
    onAnswer: (answer: AnswerType) => void
    accent?: AccentClasses
}) {
    const [currentAnswer, setCurrentAnswer] = useState<AnswerType>(
        initialValue || (question.type === 'CHECKBOX' ? [] : '')
    )

    const Component = QUESTION_COMPONENT[question.type]

    useEffect(() => {
        setCurrentAnswer(initialValue)
    }, [question.id, initialValue])

    const valid = isAnswerValid(question, currentAnswer)

    // fallback לצבע accent הבסיסי אם לא הועבר accent
    const iconBg = accent?.bgLight ?? 'bg-accent/20'
    const iconText = accent?.text ?? 'text-accent'
    const btnActive = accent ? `${accent.bg} text-white hover:opacity-90` : 'bg-accent text-accent-foreground hover:opacity-90'

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-lg">
            {/* Question Header */}
            <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                    <span className={`text-sm font-bold ${iconText}`}>?</span>
                </div>
                <h2 className="text-lg font-medium text-foreground leading-relaxed">
                    {question.question}
                </h2>
            </div>

            {/* Question Input */}
            <div className="pr-11">
                <Component
                    question={question}
                    value={currentAnswer}
                    onChange={setCurrentAnswer}
                    accent={accent}
                />
            </div>

            {/* Submit Button */}
            <div className="pr-11">
                <button
                    onClick={() => onAnswer(currentAnswer)}
                    disabled={!valid}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                        valid
                            ? btnActive
                            : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
                    }`}
                >
                    <span>המשך</span>
                    <ArrowLeft className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
