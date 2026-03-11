'use client'
import { AnswerType, QuestionType } from '@/app/types/question.type';
import React, { useState, useRef } from 'react'
import HistoryQuestionCard from '../components/HistoryQuestionCard';
import QuestionCard from '../components/QuestionCard';
import { notFound, useRouter } from 'next/navigation';
import { Sections } from '@/app/config/sections.config';
import { useQuestions } from '@/app/context/QuestionContext';
import { generateQuestions } from '@/app/lib/api';

const MAX_AI_GENERATION_ROUNDS = 3; // מקסימום 3 סבבים של יצירת שאלות

export default function page() {

  const router = useRouter();
  const { questions, sectionId, currentSectionIndex, nextSectionId, prevSectionId, addQuestions, updateAnswer } = useQuestions();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiStoppedMessage, setAiStoppedMessage] = useState<string | null>(null);
  const isGeneratingRef = useRef<boolean>(false);
  const generationRoundsRef = useRef<number>(0);

  if (currentSectionIndex === -1) {
    notFound();
  }

  const generateQuestionsInBackground = async () => {
    if (isGeneratingRef.current) return;
    
    // בדיקת הגבלת סבבים
    if (generationRoundsRef.current >= MAX_AI_GENERATION_ROUNDS) {
      console.log('Reached maximum AI generation rounds');
      return;
    }
    
    isGeneratingRef.current = true;
    setIsGenerating(true);
    
    try {
      const answeredQuestions = questions.filter(q => q.answer);
      const sectionTitle = Sections[currentSectionIndex]?.title || sectionId;
      
      const data = await generateQuestions(sectionTitle, answeredQuestions);
      
      if (!data.success) {
        console.error('Failed to generate questions');
        alert('שגיאה ביצירת שאלות. בדוק את ה-console לפרטים.');
        return;
      }
      
      // בדיקה אם ה-AI אמר להפסיק
      if (data.questions?.shouldContinue === false) {
        console.log('AI decided to stop:', data.questions?.reason);
        setAiStoppedMessage(data.questions?.reason || 'יש מספיק מידע לנושא זה');
        return;
      }
      
      // הוספת שאלות חדשות
      if (data.questions?.questions && data.questions.questions.length > 0) {
        addQuestions(data.questions.questions);
        generationRoundsRef.current += 1;
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert(`שגיאה ביצירת שאלות: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  }

  const handleAnswer = async (answer: AnswerType) => {
    updateAnswer(questions[currentIndex].id, answer);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      handleNextSection();
    }
    
    const questionsLeft = questions.length - currentIndex - 1;
    if (questionsLeft <= 2 && !isGeneratingRef.current) {
      generateQuestionsInBackground();
    }
  }

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
      {isGenerating && (
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          🤖 מכין שאלות נוספות...
        </div>
      )}
      {aiStoppedMessage && (
        <div style={{ fontSize: '14px', color: '#28a745', marginBottom: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
          ✅ {aiStoppedMessage}
        </div>
      )}
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



