import { createClient } from '@/app/lib/supabase/server';
import LandingPage from '@/app/components/LandingPage';

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let projectId: string | null = null;

  if (user) {
    const { data } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    projectId = data?.id ?? null;
  }

  return <LandingPage isLoggedIn={!!user} projectId={projectId} />;
}
