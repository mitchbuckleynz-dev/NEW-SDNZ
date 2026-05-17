import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type SyncResult = {
  slug: string;
  status: 'synced' | 'error';
  error?: string;
};

type SyncResponse = {
  success: boolean;
  synced: number;
  removed: number;
  results: SyncResult[];
};

const SYNC_URL = 'https://osqssfrxwpjedpcrajcz.supabase.co/functions/v1/notion-sync';

export function SyncPage() {
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [data, setData] = useState<SyncResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Prevent search engines from indexing this internal tool page
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  useEffect(() => {
    fetch(SYNC_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Sync failed');
        setData(json);
        setState('success');
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setState('error');
      });
  }, []);

  const now = new Date().toLocaleString('en-NZ', {
    timeZone: 'Pacific/Auckland',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '24px',
    }}>
      <div style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: '20px',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Sprinkler Design NZ"
          style={{ height: '40px', marginBottom: '32px', opacity: 0.9 }}
        />

        {/* Loading */}
        {state === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h1 style={{ color: '#f8fafc', fontSize: '20px', marginBottom: '8px' }}>Syncing from Notion…</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Fetching published articles, please wait.</p>
          </>
        )}

        {/* Success */}
        {state === 'success' && data && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ color: '#f8fafc', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
              Notion Articles Synced
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
              Your blog is up to date.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '28px' }}>
              <div style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px 28px' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#00e5a0' }}>{data.synced}</div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Published</div>
              </div>
              {data.removed > 0 && (
                <div style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px 28px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b' }}>{data.removed}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Removed</div>
                </div>
              )}
            </div>

            {/* Article list */}
            {data.results.length > 0 && (
              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', marginBottom: '24px', textAlign: 'left' }}>
                {data.results.map((r) => (
                  <div key={r.slug} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', fontSize: '13px', color: '#94a3b8' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.status === 'error' ? '#ef4444' : '#00e5a0', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.slug}</span>
                  </div>
                ))}
              </div>
            )}

            <p style={{ fontSize: '12px', color: '#334155', marginBottom: '20px' }}>Synced at {now} NZT</p>

            <Link to="/news" style={{ display: 'inline-block', background: '#00e5a0', color: '#0a0f1e', fontWeight: 700, fontSize: '14px', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none' }}>
              View live news →
            </Link>
          </>
        )}

        {/* Error */}
        {state === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ color: '#f8fafc', fontSize: '20px', marginBottom: '12px' }}>Sync Failed</h1>
            <div style={{ background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '16px', color: '#fca5a5', fontSize: '13px', textAlign: 'left', marginBottom: '24px' }}>
              {errorMsg}
            </div>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
              Check your Notion token and database ID in Supabase secrets.
            </p>
            <button
              onClick={() => { setState('loading'); setErrorMsg(''); window.location.reload(); }}
              style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px' }}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
