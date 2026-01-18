'use client'
import { AnswerType, QuestionType } from '@/app/types/question.type';
import React, { useState } from 'react'
import HistoryQuestionCard from '../components/HistoryQuestionCard';
import QuestionCard from '../components/QuestionCard';
import { parse } from 'path';
import allQuestions from '@/app/config/questions.config';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Sections } from '@/app/config/sections.config';

export default function page() {

  const router = useRouter();
  const params = useParams();
  const sectionId = params?.id;
  const sectionKeys = Object.keys(Sections);
  const currentSectionIndex = sectionKeys.findIndex(key => Sections[key as keyof typeof Sections].id === sectionId);
  if(currentSectionIndex === -1){
    notFound();
    return null;
  }
  const currentQuestions = allQuestions.find(sec => sec.id === sectionId);

  const initialQuestions = currentQuestions?.questions;
  const [questions, setQuestions] = useState<QuestionType[]>(initialQuestions || []);

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

    return q.type === 'CHECKBOX' ? [] : '';
  }

  const handleNextSection = () => {
    if(currentSectionIndex + 1 < allQuestions.length){
      const nextSectionId = Sections[sectionKeys[currentSectionIndex + 1] as keyof typeof Sections].id;
      router.push(`/brand-brief/${nextSectionId}`);
    }
  }
  const handlePrevSection = () => {
    if(currentSectionIndex > 0){
      const prevSectionId = Sections[sectionKeys[currentSectionIndex - 1] as keyof typeof Sections].id;
      router.push(`/brand-brief/${prevSectionId}`);
    }
  }

  
  return (
    <div>
      <h1>Section {sectionId}</h1>
      <h2>{currentQuestions?.title}</h2>
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

      <div>
        <button onClick={handlePrevSection} disabled={currentSectionIndex === 0}>Previous Section</button>
        <button onClick={handleNextSection} disabled={currentSectionIndex + 1 >= allQuestions.length}>Next Section</button>
      </div>
    </div>
  )
}



