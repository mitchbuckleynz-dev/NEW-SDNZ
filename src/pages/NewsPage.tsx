import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Tag, ArrowRight, Newspaper, Loader2 } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function truncate(text: string, length = 140): string {
  const plain = stripHtml(text);
  return plain.length > length ? plain.slice(0, length).trimEnd() + '…' : plain;
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="card-glass animate-pulse overflow-hidden">
    <div className="h-52 bg-white/5" />
    <div className="p-7 space-y-3">
      <div className="h-3 w-24 bg-white/10 rounded" />
      <div className="h-5 w-3/4 bg-white/10 rounded" />
      <div className="h-4 w-full bg-white/5 rounded" />
      <div className="h-4 w-5/6 bg-white/5 rounded" />
    </div>
  </div>
);

// ─── Post Card ───────────────────────────────────────────────────────────────

const PostCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const navigate = useNavigate();

  const excerpt = post.excerpt
    ? truncate(post.excerpt, 160)
    : truncate(post.content, 160);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: 'easeOut' }}
      className="card-glass card-glow overflow-hidden group cursor-pointer flex flex-col"
      onClick={() => navigate(`/news/${post.slug}`)}
      role="article"
      aria-label={post.title}
    >
      {/* Featured image */}
      <div className="relative h-52 overflow-hidden bg-slate-800/60 flex-shrink-0">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-slate-600" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

        {/* Tags overlay */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-7 flex flex-col flex-1">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        </div>

        <h2 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-green-400 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-6 flex items-center gap-1.5 text-green-400 text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
          Read Article
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
    </motion.article>
  );
};

// ─── News Page ───────────────────────────────────────────────────────────────

export function NewsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (err) {
        setError('Failed to load articles. Please try again shortly.');
      } else {
        setPosts(data as BlogPost[]);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-green-500/20 selection:text-green-300">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-green-400 text-sm font-medium mb-12 transition-colors duration-200 cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="section-label mb-6 inline-flex">
            <Newspaper className="w-3 h-3" aria-hidden="true" />
            Industry Insights
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            News &amp;{' '}
            <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Fire protection industry news, BIM technology updates, and expert insights from the Sprinkler Design NZ team.
          </p>
        </motion.div>

        {/* States */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-red-400" aria-hidden="true" />
            </div>
            <p className="text-slate-400 text-lg mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-3 text-sm font-bold cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-32">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-8 h-8 text-green-400" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Articles Coming Soon</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              We're working on insightful content about fire protection, BIM technology, and the NZ industry. Check back soon.
            </p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            {/* Featured first post */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card-glass card-glow overflow-hidden group cursor-pointer mb-8"
              onClick={() => navigate(`/news/${posts[0].slug}`)}
              aria-label={posts[0].title}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-72 md:h-auto overflow-hidden bg-slate-800/60">
                  {posts[0].featured_image ? (
                    <img
                      src={posts[0].featured_image}
                      alt={posts[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center min-h-[280px]">
                      <Newspaper className="w-16 h-16 text-slate-600" aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/60 md:block hidden" />
                </div>

                {/* Content */}
                <div className="p-10 flex flex-col justify-center">
                  <span className="section-label inline-flex mb-4">Featured</span>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={posts[0].published_at}>{formatDate(posts[0].published_at)}</time>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight group-hover:text-green-400 transition-colors duration-200">
                    {posts[0].title}
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {posts[0].excerpt ? truncate(posts[0].excerpt, 220) : truncate(posts[0].content, 220)}
                  </p>
                  {posts[0].tags && posts[0].tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {posts[0].tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="service-tag flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-green-400 font-semibold group-hover:gap-3 transition-all duration-200">
                    Read Full Article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Grid of remaining posts */}
            {posts.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1).map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
