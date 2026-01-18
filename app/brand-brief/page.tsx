'use client'
import React, { useState } from 'react'
import QuestionCard from './components/QuestionCard'
import { AnswerType, QuestionType } from '../types/question.type'
import HistoryQuestionCard from './components/HistoryQuestionCard'
import { useRouter } from 'next/navigation'
import { Sections } from '../config/sections.config'
export default function page() {

    const router = useRouter();
    const startQuestions = () =>{
        const firstSectionId = Sections.BASE_QUESTIONS.id;
        router.push(`/brand-brief/${firstSectionId}`);
    }

    return (
        <div>
            <h1>Brand Brief Page</h1>
            <p>
                This is the brand brief page.
            </p>
            <button onClick={startQuestions}>start now</button>
        </div>
    )
}



