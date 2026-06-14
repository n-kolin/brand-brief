'use client';
import { useState } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { Sections, SECTION_ACCENT_CLASSES } from '@/app/config/sections.config';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      window.location.href = '/';
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-1">
            {Sections.map((section) => (
              <div
                key={section.id}
                className={`h-3 w-3 rounded-full ${SECTION_ACCENT_CLASSES[section.id].bg}`}
              />
            ))}
            <span className="mr-3 text-2xl font-bold text-foreground">BrandAI</span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
            {isLogin ? 'ברוכים השבים' : 'יצירת חשבון'}
          </h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            {isLogin ? 'התחבר כדי להמשיך' : 'הירשם כדי להתחיל'}
          </p>

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                placeholder="אימייל"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="סיסמה"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>

            {message && (
              <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                message.type === 'error'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {message.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 font-semibold text-background transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>מעבד...</span>
                </>
              ) : (
                <span>{isLogin ? 'התחברות' : 'הרשמה'}</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? 'אין לך חשבון? ' : 'כבר יש לך חשבון? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
              className="font-semibold text-foreground transition-colors hover:text-accent"
            >
              {isLogin ? 'הרשמה' : 'התחברות'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
