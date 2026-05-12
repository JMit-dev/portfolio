import { useEffect, useState } from 'react'

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  image?: string
}

export interface Post extends PostMeta {
  content: string
}

export function usePostList() {
  const [posts, setPosts] = useState<PostMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/posts/index.json?' + Date.now())
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch posts')
        return r.json()
      })
      .then((data: PostMeta[]) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setPosts(sorted)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { posts, loading, error }
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/posts/${slug}.md?t=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error('Post not found')
        return r.text()
      })
      .then((raw) => {
        // Parse frontmatter manually (avoid gray-matter bundle issues in browser)
        const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
        if (!fmMatch) {
          setPost({ slug, title: slug, date: '', excerpt: '', content: raw })
          return
        }
        const fmRaw = fmMatch[1]
        const content = fmMatch[2]
        const fm: Record<string, string> = {}
        for (const line of fmRaw.split('\n')) {
          const [key, ...rest] = line.split(':')
          if (key && rest.length) fm[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '')
        }
        setPost({
          slug,
          title: fm.title ?? slug,
          date: fm.date ?? '',
          excerpt: fm.excerpt ?? '',
          tags: fm.tags ? fm.tags.split(',').map((t) => t.trim()) : [],
          image: fm.image,
          content,
        })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  return { post, loading, error }
}
