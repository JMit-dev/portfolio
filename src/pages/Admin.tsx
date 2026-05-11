import { useState, useEffect, useRef } from 'react'
import { siteConfig } from '../data/portfolio'
import { LogIn, LogOut, PlusCircle, Trash2, Eye, EyeOff, Upload, RefreshCw } from 'lucide-react'
import { formatDate } from '../lib/utils'

interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  image?: string
}

interface GHFile {
  content: string
  sha: string
}

const PASS_HASH_KEY = 'admin_auth'
// Simple password check — change the password by updating this hash.
// To generate: open browser console, run: btoa('yourpassword')
const ENCODED_PASS = 'Q29jb2JlbGxhMSE=' // default: "jetsetsgo" — change this!

function btoa_str(s: string) {
  return btoa(
    Array.from(new TextEncoder().encode(s), (b) => String.fromCodePoint(b)).join('')
  )
}

async function ghGet(token: string, path: string): Promise<GHFile | null> {
  const r = await fetch(
    `https://api.github.com/repos/${siteConfig.github.owner}/${siteConfig.github.repo}/contents/${path}`,
    { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
  )
  if (!r.ok) return null
  return r.json()
}

async function ghPut(token: string, path: string, content: string, sha?: string, message?: string) {
  const body: Record<string, string> = {
    message: message ?? `blog: update ${path}`,
    content: btoa_str(content),
  }
  if (sha) body.sha = sha
  const r = await fetch(
    `https://api.github.com/repos/${siteConfig.github.owner}/${siteConfig.github.repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )
  if (!r.ok) {
    const err = await r.json()
    throw new Error(err.message ?? 'GitHub API error')
  }
  return r.json()
}

async function ghDelete(token: string, path: string, sha: string, message?: string) {
  const r = await fetch(
    `https://api.github.com/repos/${siteConfig.github.owner}/${siteConfig.github.repo}/contents/${path}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message ?? `blog: delete ${path}`, sha }),
    }
  )
  if (!r.ok) throw new Error('Delete failed')
}

function generateRSS(posts: PostMeta[], domain: string): string {
  const items = posts
    .slice(0, 20)
    .map(
      (p) => `
  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>https://${domain}/blog/${p.slug}</link>
    <guid>https://${domain}/blog/${p.slug}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description><![CDATA[${p.excerpt}]]></description>
  </item>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jordan Mitacek — Blog</title>
    <link>https://${domain}/blog</link>
    <description>Thoughts on systems programming, games, and tech.</description>
    <language>en-us</language>
    <atom:link href="https://${domain}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [posts, setPosts] = useState<PostMeta[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [view, setView] = useState<'list' | 'new' | 'edit'>('list')

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    tags: '',
    image: '',
    content: '',
  })
  const [preview, setPreview] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Check session auth
  useEffect(() => {
    const sess = sessionStorage.getItem(PASS_HASH_KEY)
    if (sess) {
      setAuthed(true)
      setToken(sess)
    }
  }, [])

  const handleLogin = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (btoa_str(password) !== ENCODED_PASS) {
      setLoginError('Wrong password.')
      return
    }
    if (!token.trim()) {
      setLoginError('GitHub token required.')
      return
    }
    sessionStorage.setItem(PASS_HASH_KEY, token.trim())
    setAuthed(true)
    setLoginError('')
  }

  const handleLogout = () => {
    sessionStorage.removeItem(PASS_HASH_KEY)
    setAuthed(false)
    setToken('')
    setPassword('')
    setPosts([])
  }

  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const r = await fetch('/posts/index.json?' + Date.now())
      const data: PostMeta[] = await r.json()
      setPosts(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch {
      setPosts([])
    }
    setLoadingPosts(false)
  }

  useEffect(() => {
    if (authed) fetchPosts()
  }, [authed])

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleTitleChange = (t: string) => {
    setForm((f) => ({ ...f, title: t, slug: view === 'new' ? slugify(t) : f.slug }))
  }

  const buildMarkdown = () => {
    const tagLine = form.tags ? `tags: ${form.tags}` : ''
    const imageLine = form.image ? `image: ${form.image}` : ''
    const extras = [tagLine, imageLine].filter(Boolean).join('\n')
    return `---
title: "${form.title}"
date: "${new Date().toISOString().split('T')[0]}"
excerpt: "${form.excerpt}"
${extras}
---

${form.content}`
  }

  const savePost = async (isNew: boolean) => {
    setSaving(true)
    setSaveMsg('')
    try {
      const slug = form.slug || slugify(form.title)
      const mdContent = buildMarkdown()
      const path = `public/posts/${slug}.md`

      // Get SHA if updating
      let sha: string | undefined
      if (!isNew) {
        const existing = await ghGet(token, path)
        sha = existing?.sha
      }
      await ghPut(token, path, mdContent, sha, `blog: ${isNew ? 'add' : 'update'} "${form.title}"`)

      // Update index.json
      const newMeta: PostMeta = {
        slug,
        title: form.title,
        date: new Date().toISOString().split('T')[0],
        excerpt: form.excerpt,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        image: form.image || undefined,
      }

      const idxFile = await ghGet(token, 'public/posts/index.json')
      let existing: PostMeta[] = []
      if (idxFile) {
        existing = JSON.parse(atob(idxFile.content.replace(/\n/g, '')))
        existing = existing.filter((p) => p.slug !== slug)
      }
      existing.unshift(newMeta)
      await ghPut(
        token,
        'public/posts/index.json',
        JSON.stringify(existing, null, 2),
        idxFile?.sha,
        `blog: update index for "${form.title}"`
      )

      // Generate + commit RSS feed
      const rss = generateRSS(existing, siteConfig.domain)
      const rssFile = await ghGet(token, 'public/feed.xml')
      await ghPut(token, 'public/feed.xml', rss, rssFile?.sha ?? undefined, 'blog: regenerate RSS feed')

      setSaveMsg(`✓ Published! GitHub will rebuild in ~30s.`)
      await fetchPosts()
      setView('list')
    } catch (err: any) {
      setSaveMsg(`✗ Error: ${err.message}`)
    }
    setSaving(false)
  }

  const deletePost = async (post: PostMeta) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setSaving(true)
    setSaveMsg('')
    try {
      const path = `public/posts/${post.slug}.md`
      const file = await ghGet(token, path)
      if (file) await ghDelete(token, path, file.sha, `blog: delete "${post.title}"`)

      const idxFile = await ghGet(token, 'public/posts/index.json')
      if (idxFile) {
        let idx: PostMeta[] = JSON.parse(atob(idxFile.content.replace(/\n/g, '')))
        idx = idx.filter((p) => p.slug !== post.slug)
        await ghPut(token, 'public/posts/index.json', JSON.stringify(idx, null, 2), idxFile.sha, `blog: remove "${post.title}" from index`)
        const rss = generateRSS(idx, siteConfig.domain)
        const rssFile = await ghGet(token, 'public/feed.xml')
        await ghPut(token, 'public/feed.xml', rss, rssFile?.sha, 'blog: regenerate RSS feed')
      }
      setSaveMsg('✓ Post deleted.')
      await fetchPosts()
    } catch (err: any) {
      setSaveMsg(`✗ Error: ${err.message}`)
    }
    setSaving(false)
  }

  const uploadImage = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1]
      const path = `public/images/blog/${file.name}`
      try {
        const existing = await ghGet(token, path)
        await fetch(
          `https://api.github.com/repos/${siteConfig.github.owner}/${siteConfig.github.repo}/contents/${path}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `blog: upload image ${file.name}`,
              content: base64,
              sha: existing?.sha,
            }),
          }
        )
        setForm((f) => ({ ...f, image: `/images/blog/${file.name}` }))
        setSaveMsg(`✓ Image uploaded: /images/blog/${file.name}`)
      } catch {
        setSaveMsg('✗ Image upload failed.')
      }
    }
    reader.readAsDataURL(file)
  }

  // ── Login screen ──────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-14">
        <div className="pixel-card pixel-border p-8 w-full max-w-sm">
          <h1 className="font-pixel text-xs neon-text-green mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[9px] text-pixel-dim">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-bg border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[9px] text-pixel-dim">GitHub Token (repo scope)</label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  placeholder="ghp_..."
                  className="w-full bg-bg border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 pr-10 font-mono text-sm text-pixel-light transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-pixel-dim hover:text-neon-green"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="font-mono text-xs text-pixel-dark">
                Create at github.com → Settings → Developer settings → Tokens (classic) with <code>repo</code> scope.
              </p>
            </div>
            {loginError && <p className="font-pixel text-[9px] text-red-400">{loginError}</p>}
            <button type="submit" className="pixel-btn justify-center">
              <LogIn size={13} /> Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── New / Edit form ───────────────────────────────────────────────────
  if (view === 'new' || view === 'edit') {
    return (
      <div className="min-h-screen pt-14 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-pixel text-xs neon-text-green">
              {view === 'new' ? 'New Post' : 'Edit Post'}
            </h1>
            <button className="pixel-btn pixel-btn-cyan text-[9px]" onClick={() => setView('list')}>
              ← Back
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-pixel text-[9px] text-pixel-dim">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light"
                  placeholder="Post title"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-pixel text-[9px] text-pixel-dim">Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-mono text-sm text-pixel-light"
                  placeholder="my-post-slug"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[9px] text-pixel-dim">Excerpt (shown in list)</label>
              <input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light"
                placeholder="A short summary..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-pixel text-[9px] text-pixel-dim">Tags (comma-separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light"
                  placeholder="gaming, dev, opinion"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-pixel text-[9px] text-pixel-dim">Hero Image Path</label>
                <div className="flex gap-2">
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-mono text-sm text-pixel-light"
                    placeholder="/images/blog/cover.png"
                  />
                  <button
                    type="button"
                    className="pixel-btn pixel-btn-cyan text-[9px] py-2 px-3 flex-shrink-0"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload size={12} />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            {/* Content editor */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-pixel text-[9px] text-pixel-dim">Content (Markdown)</label>
                <button
                  type="button"
                  className="font-pixel text-[9px] text-neon-cyan hover:text-neon-green transition-colors flex items-center gap-1"
                  onClick={() => setPreview(!preview)}
                >
                  {preview ? <><EyeOff size={11} /> Edit</> : <><Eye size={11} /> Preview</>}
                </button>
              </div>
              {preview ? (
                <div className="min-h-64 bg-bg-card border-2 border-bg-border p-4 prose prose-invert prose-lg max-w-none
                  prose-headings:font-pixel prose-headings:text-neon-green
                  prose-p:font-retro prose-p:text-xl prose-p:text-pixel-dim
                  prose-a:text-neon-cyan prose-code:font-mono prose-code:text-sm
                ">
                  <ReactMarkdown>{form.content}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={20}
                  className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-mono text-sm text-pixel-light resize-y leading-relaxed"
                  placeholder="Write your post in Markdown...

# Heading

Paragraph text here. You can use **bold**, *italic*, and [links](https://example.com).

![Image alt](/images/blog/image.png)
"
                />
              )}
            </div>

            {saveMsg && (
              <p className={`font-pixel text-[9px] ${saveMsg.startsWith('✓') ? 'text-neon-green' : 'text-red-400'}`}>
                {saveMsg}
              </p>
            )}

            <div className="flex gap-3">
              <button
                className="pixel-btn"
                disabled={saving || !form.title || !form.content}
                onClick={() => savePost(view === 'new')}
              >
                {saving ? 'Publishing...' : view === 'new' ? '▶ Publish Post' : '▶ Save Changes'}
              </button>
              <button className="pixel-btn pixel-btn-cyan" onClick={() => setView('list')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Post list ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-14 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-pixel text-xs neon-text-green">
            Blog Admin<span className="animate-blink">_</span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              className="font-pixel text-[9px] text-pixel-dim hover:text-neon-green transition-colors flex items-center gap-1"
              onClick={fetchPosts}
            >
              <RefreshCw size={12} /> Refresh
            </button>
            <button
              className="pixel-btn text-[9px] py-2 px-3"
              onClick={() => {
                setForm({ title: '', slug: '', excerpt: '', tags: '', image: '', content: '' })
                setPreview(false)
                setView('new')
              }}
            >
              <PlusCircle size={12} /> New Post
            </button>
            <button className="pixel-btn pixel-btn-pink text-[9px] py-2 px-3" onClick={handleLogout}>
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>

        {saveMsg && (
          <p className={`font-pixel text-[9px] mb-4 ${saveMsg.startsWith('✓') ? 'text-neon-green' : 'text-red-400'}`}>
            {saveMsg}
          </p>
        )}

        {loadingPosts && <p className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading...</p>}

        {!loadingPosts && posts.length === 0 && (
          <div className="pixel-card p-8 text-center">
            <p className="font-pixel text-[9px] text-neon-cyan mb-2">NO POSTS</p>
            <p className="font-retro text-xl text-pixel-dim">Create your first post!</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div key={post.slug} className="pixel-card p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-pixel text-[10px] text-neon-green mb-1">{post.title}</div>
                <div className="font-mono text-xs text-pixel-dark">{formatDate(post.date)} · /{post.slug}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="font-pixel text-[9px] text-neon-cyan hover:text-neon-green transition-colors"
                  onClick={async () => {
                    // Load content for editing
                    const file = await ghGet(token, `public/posts/${post.slug}.md`)
                    if (file) {
                      const raw = atob(file.content.replace(/\n/g, ''))
                      const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
                      if (fmMatch) {
                        const fm: Record<string, string> = {}
                        for (const line of fmMatch[1].split('\n')) {
                          const [k, ...v] = line.split(':')
                          if (k) fm[k.trim()] = v.join(':').trim().replace(/^["']|["']$/g, '')
                        }
                        setForm({
                          title: fm.title ?? post.title,
                          slug: post.slug,
                          excerpt: fm.excerpt ?? post.excerpt,
                          tags: fm.tags ?? (post.tags?.join(', ') ?? ''),
                          image: fm.image ?? post.image ?? '',
                          content: fmMatch[2],
                        })
                        setView('edit')
                      }
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-pixel-dim hover:text-red-400 transition-colors"
                  onClick={() => deletePost(post)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Needed for ReactMarkdown in preview
import ReactMarkdown from 'react-markdown'
