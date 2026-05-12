import { useParams, Link } from 'react-router-dom'
import { usePost } from '../hooks/usePosts'
import { formatDate } from '../lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { post, loading, error } = usePost(slug ?? '')

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <p className="font-pixel text-[10px] text-red-400">404 — Post not found</p>
        <Link to="/blog" className="pixel-btn">
          <ArrowLeft size={13} /> Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-pixel text-[9px] text-pixel-dim hover:text-neon-green transition-colors mb-8"
        >
          <ArrowLeft size={12} /> Back to Blog
        </Link>

        {/* Hero image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full border-2 border-neon-green mb-8 max-h-80 object-cover"
          />
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <img src="/mii_portrait.png" alt="Jordan" className="w-10 h-10 object-cover border-2 border-neon-cyan/30" />
          <div className="flex flex-col gap-1">
            <span className="font-pixel text-[8px] text-neon-green">Jordan Mitacek</span>
            <span className="flex items-center gap-1 font-mono text-xs text-pixel-dim">
              <Calendar size={11} />
              {formatDate(post.date)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-pixel text-sm sm:text-base neon-text-green leading-relaxed mb-4">
          {post.title}
        </h1>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag size={12} className="text-pixel-dim" />
            {post.tags.map((tag) => (
              <span key={tag} className="badge badge-green text-[10px]">{tag}</span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:font-pixel prose-headings:text-neon-green prose-headings:leading-relaxed
          prose-h1:text-sm prose-h2:text-xs prose-h3:text-[10px]
          prose-p:font-retro prose-p:text-xl prose-p:text-pixel-dim prose-p:leading-relaxed
          prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline
          prose-strong:text-neon-green
          prose-code:font-mono prose-code:text-sm prose-code:bg-bg-card prose-code:border prose-code:border-bg-border prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none
          prose-pre:bg-bg-card prose-pre:border-2 prose-pre:border-bg-border prose-pre:rounded-none
          prose-img:border-2 prose-img:border-neon-green/30 prose-img:my-6
          prose-blockquote:border-l-neon-green prose-blockquote:text-pixel-dim
          prose-li:font-retro prose-li:text-xl prose-li:text-pixel-dim
          prose-hr:border-bg-border
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
