import { QuestionProvider } from '@/app/context/QuestionContext';
import { createClient } from '@/app/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import React from 'react';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ProjectLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;

    // אם זה לא UUID תקין — לא מדובר בפרויקט
    if (!UUID_REGEX.test(projectId)) {
        notFound();
    }

    const supabase = await createClient();

    // בדיקת auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth');
    }

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
