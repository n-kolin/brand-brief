import allQuestions from '@/app/config/questions.config';
import { Sections } from '@/app/config/sections.config';
import { QuestionProvider } from '@/app/context/QuestionContext';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function brandBriefLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}>) {
    const { id: sectionId } = await params;
  
    const sectionKey = Sections.find(
        section => section.id === sectionId
    );

    if (!sectionKey) {
        notFound();
    }

    const sectionQuestions = allQuestions.find(sec => sec.id === sectionId);
    const baseQuestions = sectionQuestions?.questions || [];
    return (
        <div>
            <QuestionProvider
                key={sectionId}
                sectionId={sectionId}
                baseQuestions={baseQuestions}
            >
                {children}
            </QuestionProvider>
        </div>
    )
}
