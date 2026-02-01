'use client'
import { AnswerType, QuestionType } from '@/app/types/question.type';
import React, { useState } from 'react'
import HistoryQuestionCard from '../components/HistoryQuestionCard';
import QuestionCard from '../components/QuestionCard';
import { parse } from 'path';
import allQuestions from '@/app/config/questions.config';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Sections } from '@/app/config/sections.config';
import { generateQuestions } from '@/app/api/gemini/route';
import { useQuestions } from '@/app/context/QuestionContext';

export default function page() {

  const router = useRouter();
  const { questions, sectionId, currentSectionIndex, nextSectionId, prevSectionId, addQuestions, updateAnswer } = useQuestions();
  if (currentSectionIndex === -1) {
    notFound();
  }



  // const handleAnswer = async (answer: AnswerType, index: number) => {
  //   const updatedQuestions = [...questions];

  //   updatedQuestions[index] = {
  //     ...updatedQuestions[index],
  //     answer
  //   }
  //   setQuestions(updatedQuestions);
  //   if(index === questions.length - 1){
  //     const newQuestions = await generateQuestions();
  //     addQuestions(newQuestions);

  //   }
  //   setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  // }
  // const addQuestions = (newQuestions: QuestionType[]) => {
  //   setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
  // }

  const handleAnswer = (answer: AnswerType) => {
    updateAnswer(questions[currentIndex].id, answer);
    // Add new question with AI 
    // if(currentIndex === questions.length - 1){
    //   //generate new questions and add
    //   generateQuestions().then(newQuestions => {
    //     addQuestions(newQuestions);
    //   });
    // }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
    else {
      handleNextSection();
    }

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
    if (nextSectionId) {
      router.push(`/brand-brief/${nextSectionId}`);
    }
  }
  const handlePrevSection = () => {
    if (prevSectionId) {
      router.push(`/brand-brief/${prevSectionId}`);
    }
  }


  return (
    <div>
      <h1>Section {sectionId}</h1>
      {/* <h2>{currentQuestions?.title}</h2> */}
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
            handleAnswer(answer)
          }
        />
        <h2>
          Answer: {getInitialValue() as string || 'No answer yet'}
        </h2>
      </div>

      <div>
        <button onClick={handlePrevSection} disabled={prevSectionId === null}>Previous Section</button>
        <button onClick={handleNextSection} disabled={nextSectionId === null}>Next Section</button>
      </div>
    </div>
  )
}



