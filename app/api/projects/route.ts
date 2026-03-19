import { createClient } from '@/app/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = request.nextUrl.searchParams.get('id');
  if (!projectId) {
    return NextResponse.json({ success: false, error: 'Missing project id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('projects')
    .select('id, sections(section_key, questions)')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: error?.message || 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project: data });
}

export async function POST() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({ user_id: user.id })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, projectId: data.id });
}
