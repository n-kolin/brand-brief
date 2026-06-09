'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { generateImage, uploadLogoToStorage, saveLogoToProject } from '@/app/lib/api';
import { SectionState } from '@/app/context/QuestionContext';
import { Download, Sparkles, Check, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-emerald-950/40 to-transparent" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-6 text-center">
        {logoUrl ? (
          /* ── לוגו מוכן ── */
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold text-foreground">הלוגו שלך מוכן!</h1>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-8 shadow-lg">
              <img src={logoUrl} alt="הלוגו שלך" className="max-h-80 w-auto object-contain" />
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-3 rounded-xl bg-emerald-500 px-10 py-4 text-base font-semibold text-white transition-all hover:opacity-90 w-full max-w-xs justify-center"
            >
              <Download className="h-5 w-5" />
              <span>הורד לוגו</span>
            </button>
            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : isGenerating ? (
          /* ── טוען ── */
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-400 mb-2">רגע אחד...</p>
              <h1 className="text-4xl font-bold text-foreground mb-3">מייצר את הלוגו שלך</h1>
              <p className="text-sm text-muted-foreground">התהליך עשוי לקחת כ-30 שניות</p>
            </div>
            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          /* ── מוכן ליצירה ── */
          <div className="flex flex-col items-center gap-6">
            {/* Icon */}
            <div className="relative mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border">
              <Check className="h-9 w-9 text-emerald-400" strokeWidth={2.5} />
              {/* dot decorations */}
              <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-emerald-500" />
              <span className="absolute -bottom-1.5 -left-1.5 h-2 w-2 rounded-full bg-emerald-500/60" />
            </div>

            <div>
              <p className="text-xs font-medium text-emerald-400 mb-2 tracking-wide">כל הכבוד!</p>
              <h1 className="text-4xl font-bold text-foreground mb-3">סיימת לענות על השאלון</h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                אספנו את כל המידע שאנחנו צריכים. עכשיו נשאר רק ליצור את הלוגו המושלם עבור העסק שלך.
              </p>
            </div>

            <button
              onClick={handleGenerate}
              className="flex items-center gap-3 rounded-xl bg-emerald-500 px-10 py-4 text-base font-semibold text-white transition-all hover:opacity-90 w-full max-w-xs justify-center"
            >
              <Sparkles className="h-5 w-5" />
              <span>ליצירת הלוגו</span>
            </button>

            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
