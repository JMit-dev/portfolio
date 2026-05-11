import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePostList } from '../hooks/usePosts'
import { formatDate } from '../lib/utils'
import { Rss, ArrowLeft } from 'lucide-react'

export default function BlogList() {
  const { posts, loading, error } = usePostList()

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-3xl mx-auto py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2 font-pixel text-[9px] text-pixel-dim hover:text-neon-green transition-colors mb-4">
              <ArrowLeft size={12} /> Back
            </Link>
            <h1 className="font-pixel text-base neon-text-green">
              Blog<span className="animate-blink">_</span>
            </h1>
          </div>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn text-[9px] py-2 px-3"
            style={{ borderColor: '#ff6b35', color: '#ff6b35' }}
          >
            <Rss size={12} /> RSS Feed
          </a>
        </div>

        {/* Posts */}
        {loading && (
          <p className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading posts...</p>
        )}
        {error && (
          <p className="font-pixel text-[9px] text-red-400">&gt; Error: {error}</p>
        )}
        {!loading && !error && posts.length === 0 && (
          <div className="pixel-card p-10 text-center border-neon-cyan/20">
            <p className="font-pixel text-[9px] text-neon-cyan mb-2">NO POSTS YET</p>
            <p className="font-retro text-xl text-pixel-dim">Check back soon!</p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={`/blog/${post.slug}`} className="block pixel-card pixel-card-cyan p-6 group">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/mii.jpg" alt="Jordan" className="w-8 h-8 object-cover border border-neon-cyan/30" />
                  <div>
                    <div className="font-pixel text-[8px] text-pixel-dim">{formatDate(post.date)}</div>
                  </div>
                </div>
                <h2 className="font-pixel text-[11px] text-neon-cyan leading-relaxed mb-2 group-hover:underline">
                  {post.title}
                </h2>
                <p className="font-retro text-xl text-pixel-dim leading-snug mb-3">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="badge text-[10px]">{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
