import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Newspaper,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function estimateReadTime(html: string): string {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="animate-pulse max-w-3xl mx-auto">
    <div className="h-3 w-24 bg-white/10 rounded mb-8" />
    <div className="h-10 w-3/4 bg-white/10 rounded mb-4" />
    <div className="h-6 w-1/2 bg-white/5 rounded mb-10" />
    <div className="h-72 bg-white/5 rounded-lg mb-10" />
    {[...Array(6)].map((_, i) => (
      <div key={i} className={`h-4 bg-white/5 rounded mb-3 ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-5/6' : 'w-4/6'}`} />
    ))}
  </div>
);

// ─── Article Page ─────────────────────────────────────────────────────────────

export function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchPost() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (err || !data) {
        setError('Article not found.');
        setLoading(false);
        return;
      }

      const article = data as BlogPost;
      setPost(article);

      // Fetch related posts (same tags, excluding current)
      const { data: relData } = await supabase
        .from('blog_posts')
        .select('id, title, slug, featured_image, published_at, excerpt, content, tags, author, created_at')
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(3);

      setRelated((relData as BlogPost[]) || []);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  // Update document title
  useEffect(() => {
    if (post) document.title = `${post.title} | Sprinkler Design NZ`;
    return () => { document.title = 'Sprinkler Design NZ'; };
  }, [post]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-green-500/20 selection:text-green-300">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate('/news')}
          className="flex items-center gap-2 text-slate-400 hover:text-green-400 text-sm font-medium mb-12 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </motion.button>

        {loading && <Skeleton />}

        {error && !loading && (
          <div className="text-center py-24">
            <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-6">{error}</p>
            <button
              onClick={() => navigate('/news')}
              className="btn-primary px-6 py-3 text-sm font-bold cursor-pointer"
            >
              Back to News
            </button>
          </div>
        )}

        {post && !loading && (
          <div className="grid lg:grid-cols-[1fr_300px] gap-16">

            {/* ── Main article ── */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 rounded-sm"
                    >
                      <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-5 text-slate-500 text-sm mb-10 pb-8 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" aria-hidden="true" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-600">{estimateReadTime(post.content)}</span>
                <button
                  onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 text-slate-400 hover:text-green-400 transition-colors duration-200 cursor-pointer"
                  aria-label="Share article"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>

              {/* Featured image */}
              {post.featured_image && (
                <div className="relative overflow-hidden rounded-lg mb-10 shadow-2xl shadow-black/50">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full object-cover max-h-[480px]"
                  />
                </div>
              )}

              {/* Excerpt (if exists, as lead paragraph) */}
              {post.excerpt && (
                <p className="text-xl text-slate-300 leading-relaxed mb-8 font-light border-l-2 border-green-500/50 pl-6">
                  {post.excerpt}
                </p>
              )}

              {/* Article body — RankPill sends HTML */}
              <div
                className="prose-news"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Bottom share */}
              <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => navigate('/news')}
                  className="flex items-center gap-2 text-slate-400 hover:text-green-400 text-sm transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All Articles
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-slate-400 hover:text-green-400 text-sm transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Share Article'}
                </button>
              </div>
            </motion.article>

            {/* ── Sidebar ── */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* About card */}
              <div className="card-glass p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  About Sprinkler Design NZ
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  New Zealand's leading independent fire protection design consultancy, combining deep trade knowledge with the latest BIM technology.
                </p>
                <a
                  href="/#contact"
                  className="btn-primary block text-center px-4 py-2.5 text-sm font-bold cursor-pointer"
                >
                  Get in Touch
                </a>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="card-glass p-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
                    More Articles
                  </h3>
                  <div className="space-y-5">
                    {related.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => navigate(`/news/${r.slug}`)}
                        className="w-full text-left group cursor-pointer"
                      >
                        {r.featured_image && (
                          <div className="overflow-hidden rounded mb-2 h-28">
                            <img
                              src={r.featured_image}
                              alt={r.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <p className="text-slate-300 text-sm font-medium group-hover:text-green-400 transition-colors duration-200 leading-snug flex items-start gap-1">
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-green-500" aria-hidden="true" />
                          {r.title}
                        </p>
                        <p className="text-slate-600 text-xs mt-1">{formatDate(r.published_at)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        )}
      </div>
    </div>
  );
}
