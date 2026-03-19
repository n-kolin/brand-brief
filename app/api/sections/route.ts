import { createClient } from '@/app/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId, sectionKey, sectionTitle, questions } = await request.json();

  if (!projectId || !sectionKey || !sectionTitle || !questions) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  const { error } = await supabase
    .from('sections')
    .upsert({
      project_id: projectId,
      section_key: sectionKey,
      title: sectionTitle,
      questions,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'project_id,section_key' });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
