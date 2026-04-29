'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { generateImage, uploadLogoToStorage, saveLogoToProject } from '@/app/lib/api';
import { SectionState } from '@/app/context/QuestionContext';

type ProjectData = {
  logo_url: string | null;
  logo_prompt: string | null;
  sections: { section_key: string; title: string; questions: any[] }[];
};

export default function LogoPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from('projects')
        .select('logo_url, logo_prompt, sections(section_key, title, questions)')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProject(data as ProjectData);
        if (data.logo_url) setLogoUrl(data.logo_url);
      }
    }
    load();
  }, [projectId, router]);

  const handleGenerate = async () => {
    if (!project || !userId) return;
    setIsGenerating(true);
    setError(null);

    try {
      const sections: SectionState[] = project.sections.map(s => ({
        sectionId: s.section_key,
        title: s.title,
        questions: s.questions,
        completed: true,
      }));

      const result = await generateImage(sections);
      if (!result.success || !result.imageData || !result.mimeType) {
        setError(result.error || 'שגיאה ביצירת הלוגו');
        return;
      }

      const uploadResult = await uploadLogoToStorage(result.imageData, result.mimeType, userId, projectId);
      if (!uploadResult.success || !uploadResult.logoUrl) {
        setError(uploadResult.error || 'שגיאה בשמירת הלוגו');
        return;
      }

      await saveLogoToProject(projectId, uploadResult.logoUrl, result.imagePrompt || '');
      setLogoUrl(uploadResult.logoUrl);
    } catch (e) {
      setError('משהו השתבש, נסה שוב');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!logoUrl) return;
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logo.png';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32, textAlign: 'center' }}>
      <h1>הלוגו שלך</h1>

      {logoUrl ? (
        <div>
          <img src={logoUrl} alt="לוגו" style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 24 }} />
          <button
            onClick={handleDownload}
            style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: '#000', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            הורד לוגו
          </button>
        </div>
      ) : (
        <div>
          <p>השאלון הושלם! לחץ על הכפתור ליצירת הלוגו.</p>
          <button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? 'מייצר לוגו... (עשוי לקחת כ-30 שניות)' : 'צור לוגו'}
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: 16 }}>{error}</p>}
    </div>
  );
}
