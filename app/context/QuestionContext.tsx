'use client';
import React, { createContext, FC, ReactNode, useContext, useState } from "react";
import { AnswerType, QuestionType } from "../types/question.type";
import { Sections } from "../config/sections.config";

interface QuestionContextType {
    sectionId: string;
    questions: QuestionType[];
    currentSectionIndex: number;
    nextSectionId: string | null;
    prevSectionId: string | null;
    addQuestions: (newQuestions: QuestionType[]) => void;
    updateAnswer: (questionId: string, answer: any) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

interface QuestionProviderProps {
    children: ReactNode;
    sectionId: string;
    baseQuestions: QuestionType[];
}
export const QuestionProvider: FC<QuestionProviderProps> = ({ children, sectionId, baseQuestions }) => {
    const [questions, setQuestions] = useState<QuestionType[]>(baseQuestions);

    const addQuestions = (newQuestions: QuestionType[]) => {
        setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
    };

    const updateAnswer = (questionId: string, answer: AnswerType) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.id === questionId ? { ...q, answer } : q
            )
        );
    };

    const currentSectionIndex = Sections.findIndex(section => 
        section.id === sectionId
    );
    const nextSectionId = Sections[currentSectionIndex + 1]?.id || null;
    const prevSectionId = Sections[currentSectionIndex - 1]?.id || null;
    return (
        <QuestionContext.Provider value={{
            questions,
            sectionId,
            currentSectionIndex,
            nextSectionId,
            prevSectionId,
            addQuestions,
            updateAnswer
        }}
        >
            {children}
        </QuestionContext.Provider>
    );
}

export const useQuestions = (): QuestionContextType => {
    const context = useContext(QuestionContext);
    if (!context) {
        throw new Error("useQuestions must be used within a QuestionProvider");
    }
    return context;
}