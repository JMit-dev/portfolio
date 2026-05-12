import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDate } from '../lib/utils'
import { Rss, ArrowRight } from 'lucide-react'

interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<PostMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/posts/index.json')
      .then((r) => r.json())
      .then((data: PostMeta[]) => {
        setPosts(data.slice(0, 3))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="blog" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="section-heading mb-0">Blog</h2>
          <div className="flex items-center gap-3">
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-pixel text-[9px] text-neon-orange hover:text-neon-yellow transition-colors"
              title="RSS Feed"
            >
              <Rss size={13} />
              RSS
            </a>
          </div>
        </motion.div>

        {loading ? (
          <div className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="pixel-card p-8 text-center border-neon-cyan/20">
            <p className="font-pixel text-[9px] text-neon-cyan mb-2">NO POSTS YET</p>
            <p className="font-retro text-xl text-pixel-dim">Check back soon for blog posts!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="block pixel-card pixel-card-cyan h-full p-5 group">
                  {/* Mii avatar */}
                  <div className="flex items-center gap-2 mb-3">
                    <img src="/mii_portrait.png" alt="Jordan Mii" className="w-7 h-7 object-cover border border-neon-cyan/30" />
                    <span className="font-pixel text-[8px] text-pixel-dim">{formatDate(post.date)}</span>
                  </div>

                  <h3 className="font-pixel text-[9px] text-neon-cyan leading-relaxed mb-2 group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="font-retro text-lg text-pixel-dim leading-snug mb-3 line-clamp-3">{post.excerpt}</p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="badge text-[10px]">{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-6 text-center">
            <Link to="/blog" className="pixel-btn pixel-btn-cyan inline-flex">
              View All Posts <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
