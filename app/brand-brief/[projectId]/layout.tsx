import { QuestionProvider } from '@/app/context/QuestionContext';
import { createClient } from '@/app/lib/supabase/server';
import React from 'react';

export default async function BrandBriefLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from('projects')
        .select('id, sections(section_key, questions)')
        .eq('id', projectId)
        .single();

    const savedSections = data?.sections ?? [];

    return (
        <QuestionProvider projectId={projectId} savedSections={savedSections}>
            {children}
        </QuestionProvider>
    );
}
