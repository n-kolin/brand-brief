'use client';
import React, { createContext, FC, ReactNode, useContext, useState } from "react";
import { AnswerType, QuestionType } from "../types/question.type";
import { Sections } from "../config/sections.config";
import allQuestions from "../config/questions.config";

export type SectionState = {
    sectionId: string;
    title: string;
    questions: QuestionType[];
    completed: boolean;
}

interface QuestionContextType {
    projectId: string;
    sections: SectionState[];
    currentSectionIndex: number;
    currentSection: SectionState;
    addQuestions: (newQuestions: QuestionType[]) => void;
    updateAnswer: (questionId: string, answer: AnswerType) => void;
    completeSection: () => void;
    goToPrevSection: () => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

type SavedSection = {
    section_key: string;
    questions: QuestionType[];
};

interface QuestionProviderProps {
    children: ReactNode;
    projectId: string;
    savedSections?: SavedSection[];
}

function buildInitialSections(savedSections?: SavedSection[]): SectionState[] {
    return Sections.map((section) => {
        const saved = savedSections?.find(s => s.section_key === section.id);
        return {
            sectionId: section.id,
            title: section.title,
            questions: saved?.questions ?? allQuestions.find(q => q.id === section.id)?.questions ?? [],
            completed: !!saved,
        };
    });
}

function getResumeIndex(sections: SectionState[]): number {
    const firstIncomplete = sections.findIndex(s => !s.completed);
    return firstIncomplete === -1 ? sections.length - 1 : firstIncomplete;
}

export const QuestionProvider: FC<QuestionProviderProps> = ({ children, projectId, savedSections }) => {
    const [sections, setSections] = useState<SectionState[]>(() => buildInitialSections(savedSections));
    const [currentSectionIndex, setCurrentSectionIndex] = useState(() =>
        getResumeIndex(buildInitialSections(savedSections))
    );

    const currentSection = sections[currentSectionIndex];

    const addQuestions = (newQuestions: QuestionType[]) => {
        setSections(prev => prev.map((s, i) =>
            i === currentSectionIndex
                ? { ...s, questions: [...s.questions, ...newQuestions] }
                : s
        ));
    };

    const updateAnswer = (questionId: string, answer: AnswerType) => {
        setSections(prev => prev.map((s, i) =>
            i === currentSectionIndex
                ? { ...s, questions: s.questions.map(q => q.id === questionId ? { ...q, answer } : q) }
                : s
        ));
    };

    const completeSection = () => {
        setSections(prev => prev.map((s, i) =>
            i === currentSectionIndex ? { ...s, completed: true } : s
        ));
        if (currentSectionIndex < Sections.length - 1) {
            setCurrentSectionIndex(prev => prev + 1);
        }
    };

    const goToPrevSection = () => {
        if (currentSectionIndex > 0) {
            setCurrentSectionIndex(prev => prev - 1);
        }
    };

    return (
        <QuestionContext.Provider value={{
            projectId,
            sections,
            currentSectionIndex,
            currentSection,
            addQuestions,
            updateAnswer,
            completeSection,
            goToPrevSection,
        }}>
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
