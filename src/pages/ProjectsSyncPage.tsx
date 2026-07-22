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

const SYNC_URL = 'https://osqssfrxwpjedpcrajcz.supabase.co/functions/v1/projects-sync';

export function ProjectsSyncPage() {
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="card p-8 md:p-12 max-w-lg w-full text-center">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Sprinkler Design NZ"
          className="h-12 mx-auto mb-8 object-contain"
        />

        {/* Loading */}
        {state === 'loading' && (
          <>
            <div className="w-8 h-8 border-2 border-slate-200 border-t-[#73d63b] rounded-full animate-spin mx-auto mb-5" />
            <h1 className="text-slate-900 text-xl font-semibold mb-2">Syncing Projects from Notion…</h1>
            <p className="text-slate-500 text-sm m-0">Fetching published projects, please wait.</p>
          </>
        )}

        {/* Success */}
        {state === 'success' && data && (
          <>
            <div className="check-badge mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h1 className="text-slate-900 text-xl font-semibold mb-2">Projects synced</h1>
            <p className="text-slate-500 text-sm mb-8">Your project portfolio is up to date.</p>

            {/* Stats */}
            <div className="flex gap-4 justify-center mb-7">
              <div className="figure-block !py-4 !px-7">
                <p className="eyebrow justify-center mb-1">Published</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums m-0">{data.synced}</p>
              </div>
              {data.removed > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 py-4 px-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1 m-0">Removed</p>
                  <p className="text-3xl font-bold text-slate-900 tabular-nums m-0">{data.removed}</p>
                </div>
              )}
            </div>

            {/* Project list */}
            {data.results.length > 0 && (
              <div className="border-t border-slate-200 pt-4 mb-6 text-left">
                {data.results.map((r) => (
                  <div key={r.slug} className="flex items-center gap-2.5 py-1.5 text-[13px] text-slate-600">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${r.status === 'error' ? 'bg-[#e5433a]' : 'bg-[#73d63b]'}`} />
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{r.slug}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-400 mb-6">Synced at {now} NZT</p>

            <Link to="/projects" className="btn-primary text-sm">
              View live projects →
            </Link>
          </>
        )}

        {/* Error */}
        {state === 'error' && (
          <>
            <h1 className="text-slate-900 text-xl font-semibold mb-4">Sync failed</h1>
            <div className="rounded-lg border border-[#e5433a]/40 bg-[#e5433a]/5 p-4 text-[#b91c1c] text-[13px] text-left mb-6">
              {errorMsg}
            </div>
            <p className="text-slate-500 text-[13px] mb-6">
              Check that <code className="bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700">NOTION_PROJECTS_DB_ID</code> is set in Supabase secrets.
            </p>
            <button
              onClick={() => { setState('loading'); setErrorMsg(''); window.location.reload(); }}
              className="btn-ghost text-sm"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
