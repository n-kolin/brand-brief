'use client';

import { useState } from 'react';
import { createClient } from '@/app/lib/supabase/client';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
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
    } else if (!isLogin) {
      setMessage({ text: 'Check your email to confirm your account!', type: 'success' });
    } else {
      window.location.href = '/';
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>
          {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
        </p>

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
            }}
          />

          {message && (
            <p style={{
              color: message.type === 'error' ? '#e53e3e' : '#38a169',
              fontSize: '14px',
              textAlign: 'center',
            }}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: '#171717',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading...' : isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
            style={{ background: 'none', border: 'none', color: '#171717', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
