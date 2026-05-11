import { useState, useEffect, useRef } from 'react'
import { siteConfig } from '../data/portfolio'
import { LogIn, LogOut, PlusCircle, Trash2, Eye, EyeOff, Upload, RefreshCw, Pencil } from 'lucide-react'
import { formatDate } from '../lib/utils'
import ReactMarkdown from 'react-markdown'

// ── Types ────────────────────────────────────────────────────────────────────

interface PostMeta {
  slug: string; title: string; date: string; excerpt: string; tags?: string[]; image?: string
}
interface Project {
  id: string; title: string; description: string; image?: string; tech: string[]
  links: { github?: string; itchio?: string; live?: string; demo?: string; devpost?: string; paper?: string }
  date?: string
}
interface Achievement {
  id: string; title: string; description: string; image?: string; url?: string; date?: string
}
interface Game {
  id: string; title: string; description: string; url: string; image?: string; tech: string[]
}
interface GHFile { content: string; sha: string }

type Tab = 'blog' | 'projects' | 'achievements' | 'games'
type View = 'list' | 'new' | 'edit'

// ── Auth ─────────────────────────────────────────────────────────────────────

const PASS_HASH_KEY = 'admin_auth'
const ENCODED_PASS = 'Q29jb2JlbGxhMSE='

function btoa_str(s: string) {
  return btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCodePoint(b)).join(''))
}

// ── GitHub API helpers ───────────────────────────────────────────────────────

const ghBase = `https://api.github.com/repos/${siteConfig.github.owner}/${siteConfig.github.repo}/contents`

async function ghGet(token: string, path: string): Promise<GHFile | null> {
  const r = await fetch(`${ghBase}/${path}`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
  return r.ok ? r.json() : null
}

async function ghPut(token: string, path: string, content: string, sha?: string, message?: string) {
  const r = await fetch(`${ghBase}/${path}`, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message ?? `update ${path}`, content: btoa_str(content), ...(sha ? { sha } : {}) }),
  })
  if (!r.ok) { const e = await r.json(); throw new Error(e.message ?? 'GitHub API error') }
  return r.json()
}

async function ghDelete(token: string, path: string, sha: string, message?: string) {
  const r = await fetch(`${ghBase}/${path}`, {
    method: 'DELETE',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message ?? `delete ${path}`, sha }),
  })
  if (!r.ok) throw new Error('Delete failed')
}

async function loadIndex<T>(token: string, path: string): Promise<{ items: T[]; sha: string | undefined }> {
  const file = await ghGet(token, path)
  if (!file) return { items: [], sha: undefined }
  const items: T[] = JSON.parse(atob(file.content.replace(/\n/g, '')))
  return { items, sha: file.sha }
}

async function saveIndex<T>(token: string, path: string, items: T[], sha: string | undefined, message: string) {
  await ghPut(token, path, JSON.stringify(items, null, 2), sha, message)
}

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

// ── RSS helper ───────────────────────────────────────────────────────────────

function generateRSS(posts: PostMeta[], domain: string) {
  const items = posts.slice(0, 20).map((p) => `
  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>https://${domain}/blog/${p.slug}</link>
    <guid>https://${domain}/blog/${p.slug}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description><![CDATA[${p.excerpt}]]></description>
  </item>`).join('')
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

// ── Shared sub-components ────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-pixel text-[9px] text-pixel-dim">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light transition-colors w-full'
const monoInputCls = 'bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-mono text-sm text-pixel-light transition-colors w-full'

// ── Main Admin component ─────────────────────────────────────────────────────

export default function Admin() {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem(PASS_HASH_KEY))
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() => sessionStorage.getItem(PASS_HASH_KEY) ?? '')
  const [showToken, setShowToken] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('blog')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const handleLogin = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (btoa_str(password) !== ENCODED_PASS) { setLoginError('Wrong password.'); return }
    if (!token.trim()) { setLoginError('GitHub token required.'); return }
    sessionStorage.setItem(PASS_HASH_KEY, token.trim())
    setAuthed(true); setLoginError('')
  }

  const handleLogout = () => {
    sessionStorage.removeItem(PASS_HASH_KEY)
    setAuthed(false); setToken(''); setPassword('')
  }

  const uploadImage = async (file: File, folder: string, onDone: (path: string) => void) => {
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1]
      const path = `public/images/${folder}/${file.name}`
      const existing = await ghGet(token, path)
      await fetch(`${ghBase}/${path}`, {
        method: 'PUT',
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `upload image ${file.name}`, content: base64, ...(existing ? { sha: existing.sha } : {}) }),
      })
      onDone(`/images/${folder}/${file.name}`)
      setSaveMsg(`✓ Uploaded /images/${folder}/${file.name}`)
    }
    reader.readAsDataURL(file)
  }

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-14">
        <div className="pixel-card pixel-border p-8 w-full max-w-sm">
          <h1 className="font-pixel text-xs neon-text-green mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Field label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} />
            </Field>
            <Field label="GitHub Token (repo scope)">
              <div className="relative">
                <input type={showToken ? 'text' : 'password'} value={token} onChange={(e) => setToken(e.target.value)} required placeholder="ghp_..." className={`${monoInputCls} pr-10`} />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-pixel-dim hover:text-neon-green" onClick={() => setShowToken(!showToken)}>
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>
            {loginError && <p className="font-pixel text-[9px] text-red-400">{loginError}</p>}
            <button type="submit" className="pixel-btn justify-center"><LogIn size={13} /> Enter</button>
          </form>
        </div>
      </div>
    )
  }

  const tabs: { key: Tab; label: string; color: string }[] = [
    { key: 'blog',         label: 'Blog',         color: 'neon-cyan' },
    { key: 'projects',     label: 'Projects',     color: 'neon-green' },
    { key: 'achievements', label: 'Achievements', color: 'neon-yellow' },
    { key: 'games',        label: 'Games',        color: 'neon-pink' },
  ]

  return (
    <div className="min-h-screen pt-14 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-pixel text-xs neon-text-green">Admin<span className="animate-blink">_</span></h1>
          <button className="pixel-btn pixel-btn-pink text-[9px] py-2 px-3" onClick={handleLogout}>
            <LogOut size={12} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSaveMsg('') }}
              className={`font-pixel text-[9px] px-4 py-2 border-2 transition-all ${
                tab === t.key
                  ? `border-${t.color} text-${t.color} bg-${t.color}/10`
                  : 'border-bg-border text-pixel-dim hover:border-pixel-dim'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {saveMsg && (
          <p className={`font-pixel text-[9px] mb-4 ${saveMsg.startsWith('✓') ? 'text-neon-green' : 'text-red-400'}`}>
            {saveMsg}
          </p>
        )}

        {/* Tab content */}
        {tab === 'blog' && (
          <BlogTab token={token} saving={saving} setSaving={setSaving} setSaveMsg={setSaveMsg} uploadImage={(f, cb) => uploadImage(f, 'blog', cb)} />
        )}
        {tab === 'projects' && (
          <ProjectsTab token={token} saving={saving} setSaving={setSaving} setSaveMsg={setSaveMsg} uploadImage={(f, cb) => uploadImage(f, 'projects', cb)} />
        )}
        {tab === 'achievements' && (
          <AchievementsTab token={token} saving={saving} setSaving={setSaving} setSaveMsg={setSaveMsg} uploadImage={(f, cb) => uploadImage(f, 'achievements', cb)} />
        )}
        {tab === 'games' && (
          <GamesTab token={token} saving={saving} setSaving={setSaving} setSaveMsg={setSaveMsg} uploadImage={(f, cb) => uploadImage(f, 'games', cb)} />
        )}
      </div>
    </div>
  )
}

// ── Blog Tab ─────────────────────────────────────────────────────────────────

function BlogTab({ token, saving, setSaving, setSaveMsg, uploadImage }: {
  token: string; saving: boolean; setSaving: (v: boolean) => void; setSaveMsg: (v: string) => void
  uploadImage: (f: File, cb: (path: string) => void) => void
}) {
  const [posts, setPosts] = useState<PostMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('list')
  const [preview, setPreview] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', tags: '', image: '', content: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const fetchPosts = async () => {
    try {
      const r = await fetch('/posts/index.json?' + Date.now())
      const data: PostMeta[] = await r.json()
      setPosts(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch { setPosts([]) }
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPosts() }, [])

  const buildMarkdown = () => {
    const extras = [form.tags ? `tags: ${form.tags}` : '', form.image ? `image: ${form.image}` : ''].filter(Boolean).join('\n')
    return `---\ntitle: "${form.title}"\ndate: "${new Date().toISOString().split('T')[0]}"\nexcerpt: "${form.excerpt}"\n${extras}\n---\n\n${form.content}`
  }

  const save = async (isNew: boolean) => {
    setSaving(true); setSaveMsg('')
    try {
      const slug = form.slug || slugify(form.title)
      const path = `public/posts/${slug}.md`
      const existing = isNew ? null : await ghGet(token, path)
      await ghPut(token, path, buildMarkdown(), existing?.sha, `blog: ${isNew ? 'add' : 'update'} "${form.title}"`)

      const newMeta: PostMeta = { slug, title: form.title, date: new Date().toISOString().split('T')[0], excerpt: form.excerpt, tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [], image: form.image || undefined }
      const { items: idx, sha: idxSha } = await loadIndex<PostMeta>(token, 'public/posts/index.json')
      const updated = [newMeta, ...idx.filter((p) => p.slug !== slug)]
      await saveIndex(token, 'public/posts/index.json', updated, idxSha, `blog: update index`)

      const rssFile = await ghGet(token, 'public/feed.xml')
      await ghPut(token, 'public/feed.xml', generateRSS(updated, siteConfig.domain), rssFile?.sha, 'blog: regenerate RSS')

      setSaveMsg('✓ Published! Site rebuilds in ~30s.')
      await fetchPosts(); setView('list')
    } catch (e: any) { setSaveMsg(`✗ ${e.message}`) }
    setSaving(false)
  }

  const deletePost = async (post: PostMeta) => {
    if (!confirm(`Delete "${post.title}"?`)) return
    setSaving(true)
    try {
      const file = await ghGet(token, `public/posts/${post.slug}.md`)
      if (file) await ghDelete(token, `public/posts/${post.slug}.md`, file.sha, `blog: delete "${post.title}"`)
      const { items: idx, sha } = await loadIndex<PostMeta>(token, 'public/posts/index.json')
      const updated = idx.filter((p) => p.slug !== post.slug)
      await saveIndex(token, 'public/posts/index.json', updated, sha, `blog: remove "${post.title}"`)
      const rssFile = await ghGet(token, 'public/feed.xml')
      await ghPut(token, 'public/feed.xml', generateRSS(updated, siteConfig.domain), rssFile?.sha, 'blog: regenerate RSS')
      setSaveMsg('✓ Deleted.'); await fetchPosts()
    } catch (e: any) { setSaveMsg(`✗ ${e.message}`) }
    setSaving(false)
  }

  const openEdit = async (post: PostMeta) => {
    const file = await ghGet(token, `public/posts/${post.slug}.md`)
    if (!file) return
    const raw = atob(file.content.replace(/\n/g, ''))
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (fmMatch) {
      const fm: Record<string, string> = {}
      for (const line of fmMatch[1].split('\n')) { const [k, ...v] = line.split(':'); if (k) fm[k.trim()] = v.join(':').trim().replace(/^["']|["']$/g, '') }
      setForm({ title: fm.title ?? post.title, slug: post.slug, excerpt: fm.excerpt ?? post.excerpt, tags: fm.tags ?? (post.tags?.join(', ') ?? ''), image: fm.image ?? post.image ?? '', content: fmMatch[2] })
    }
    setView('edit')
  }

  if (view !== 'list') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-pixel text-[10px] text-neon-cyan">{view === 'new' ? 'New Post' : 'Edit Post'}</h2>
          <button className="pixel-btn pixel-btn-cyan text-[9px]" onClick={() => setView('list')}>← Back</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: view === 'new' ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : form.slug })} className={inputCls} placeholder="Post title" /></Field>
          <Field label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={monoInputCls} placeholder="post-slug" /></Field>
        </div>
        <Field label="Excerpt"><input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputCls} placeholder="Short summary..." /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tags (comma-separated)"><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} placeholder="gaming, dev" /></Field>
          <Field label="Hero Image">
            <div className="flex gap-2">
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={`${monoInputCls} flex-1`} placeholder="/images/blog/cover.png" />
              <button type="button" className="pixel-btn pixel-btn-cyan text-[9px] px-3 flex-shrink-0" onClick={() => fileRef.current?.click()}><Upload size={12} /></button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], (p) => setForm((f) => ({ ...f, image: p })))} />
            </div>
          </Field>
        </div>
        <Field label={<span className="flex items-center justify-between w-full">Content (Markdown) <button type="button" className="font-pixel text-[9px] text-neon-cyan hover:text-neon-green transition-colors flex items-center gap-1" onClick={() => setPreview(!preview)}>{preview ? <><EyeOff size={11} /> Edit</> : <><Eye size={11} /> Preview</>}</button></span> as any}>
          {preview
            ? <div className="min-h-64 bg-bg-card border-2 border-bg-border p-4 prose prose-invert prose-lg max-w-none prose-headings:font-pixel prose-headings:text-neon-green prose-p:font-retro prose-p:text-xl prose-p:text-pixel-dim prose-a:text-neon-cyan"><ReactMarkdown>{form.content}</ReactMarkdown></div>
            : <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={18} className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-mono text-sm text-pixel-light resize-y leading-relaxed w-full" placeholder="Write in Markdown..." />
          }
        </Field>
        <div className="flex gap-3">
          <button className="pixel-btn" disabled={saving || !form.title} onClick={() => save(view === 'new')}>{saving ? 'Publishing...' : view === 'new' ? '▶ Publish' : '▶ Save'}</button>
          <button className="pixel-btn pixel-btn-cyan" onClick={() => setView('list')}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-[10px] text-neon-cyan">Posts</h2>
        <div className="flex gap-2">
          <button className="font-pixel text-[9px] text-pixel-dim hover:text-neon-green flex items-center gap-1" onClick={fetchPosts}><RefreshCw size={12} /></button>
          <button className="pixel-btn text-[9px] py-2 px-3" onClick={() => { setForm({ title: '', slug: '', excerpt: '', tags: '', image: '', content: '' }); setPreview(false); setView('new') }}><PlusCircle size={12} /> New Post</button>
        </div>
      </div>
      {loading && <p className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading...</p>}
      {!loading && posts.length === 0 && <p className="font-retro text-xl text-pixel-dim">No posts yet.</p>}
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.slug} className="pixel-card p-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-pixel text-[10px] text-neon-cyan mb-1">{post.title}</div>
              <div className="font-mono text-xs text-pixel-dark">{formatDate(post.date)}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="text-pixel-dim hover:text-neon-cyan transition-colors" onClick={() => openEdit(post)}><Pencil size={14} /></button>
              <button className="text-pixel-dim hover:text-red-400 transition-colors" onClick={() => deletePost(post)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Generic JSON-index CRUD tab ───────────────────────────────────────────────

function JsonTab<T extends { id: string }>({
  token, saving, setSaving, setSaveMsg, uploadImage,
  indexPath, color, label,
  emptyForm, renderForm, renderListItem,
}: {
  token: string; saving: boolean; setSaving: (v: boolean) => void; setSaveMsg: (v: string) => void
  uploadImage: (f: File, cb: (path: string) => void) => void
  indexPath: string; color: string; label: string
  emptyForm: T
  renderForm: (form: T, setForm: React.Dispatch<React.SetStateAction<T>>, fileRef: React.RefObject<HTMLInputElement | null>) => React.ReactNode
  renderListItem: (item: T) => React.ReactNode
}) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<View>('list')
  const [form, setForm] = useState<T>(emptyForm)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetch_ = async () => {
    setLoading(true)
    const { items: data } = await loadIndex<T>(token, indexPath)
    setItems(data); setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch_() }, [])

  const save = async () => {
    setSaving(true); setSaveMsg('')
    try {
      const isNew = view === 'new'
      const entry = isNew ? { ...form, id: genId() } : form
      const updated = isNew ? [entry, ...items] : items.map((i) => i.id === entry.id ? entry : i)
      const { sha } = await loadIndex<T>(token, indexPath)
      await saveIndex(token, indexPath, updated, sha, `${label}: ${isNew ? 'add' : 'update'} "${(entry as any).title}"`)
      setSaveMsg('✓ Saved! Site rebuilds in ~30s.')
      await fetch_(); setView('list')
    } catch (e: any) { setSaveMsg(`✗ ${e.message}`) }
    setSaving(false)
  }

  const remove = async (item: T) => {
    if (!confirm(`Delete "${(item as any).title}"?`)) return
    setSaving(true)
    try {
      const updated = items.filter((i) => i.id !== item.id)
      const { sha } = await loadIndex<T>(token, indexPath)
      await saveIndex(token, indexPath, updated, sha, `${label}: delete "${(item as any).title}"`)
      setSaveMsg('✓ Deleted.'); await fetch_()
    } catch (e: any) { setSaveMsg(`✗ ${e.message}`) }
    setSaving(false)
  }

  const colorClass = `text-${color}`

  if (view !== 'list') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className={`font-pixel text-[10px] ${colorClass}`}>{view === 'new' ? `New ${label}` : `Edit ${label}`}</h2>
          <button className="pixel-btn pixel-btn-cyan text-[9px]" onClick={() => setView('list')}>← Back</button>
        </div>
        {renderForm(form, setForm, fileRef)}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], (p) => setForm((f) => ({ ...f, image: p })))} />
        <div className="flex gap-3">
          <button className="pixel-btn" disabled={saving || !(form as any).title} onClick={save}>{saving ? 'Saving...' : view === 'new' ? '▶ Add' : '▶ Save'}</button>
          <button className="pixel-btn pixel-btn-cyan" onClick={() => setView('list')}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-pixel text-[10px] ${colorClass}`}>{label}s</h2>
        <div className="flex gap-2">
          <button className="font-pixel text-[9px] text-pixel-dim hover:text-neon-green flex items-center gap-1" onClick={fetch_}><RefreshCw size={12} /></button>
          <button className="pixel-btn text-[9px] py-2 px-3" onClick={() => { setForm(emptyForm); setView('new') }} style={{ borderColor: `var(--tw-${color})` }}><PlusCircle size={12} /> New</button>
        </div>
      </div>
      {loading && <p className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading...</p>}
      {!loading && items.length === 0 && <p className="font-retro text-xl text-pixel-dim">None yet — add one!</p>}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className={`pixel-card p-4 flex items-center justify-between gap-4 border-${color}/20`}>
            <div className="flex-1 min-w-0">{renderListItem(item)}</div>
            <div className="flex gap-2 flex-shrink-0">
              <button className={`text-pixel-dim hover:${colorClass} transition-colors`} onClick={() => { setForm(item); setView('edit') }}><Pencil size={14} /></button>
              <button className="text-pixel-dim hover:text-red-400 transition-colors" onClick={() => remove(item)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Projects Tab ──────────────────────────────────────────────────────────────

const emptyProject: Project = { id: '', title: '', description: '', image: '', tech: [], links: {}, date: '' }

function ProjectsTab(props: { token: string; saving: boolean; setSaving: (v: boolean) => void; setSaveMsg: (v: string) => void; uploadImage: (f: File, cb: (p: string) => void) => void }) {
  return (
    <JsonTab<Project>
      {...props}
      indexPath="public/projects/index.json"
      color="neon-green"
      label="Project"
      emptyForm={emptyProject}
      renderListItem={(p) => (
        <>
          <div className="font-pixel text-[10px] text-neon-green mb-1 truncate">{p.title}</div>
          <div className="font-mono text-xs text-pixel-dark">{p.tech.join(', ').slice(0, 60)}</div>
        </>
      )}
      renderForm={(form, setForm, fileRef) => (
        <div className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Project name" /></Field>
            <Field label="Date (optional)"><input value={form.date ?? ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} placeholder="2025" /></Field>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light resize-y w-full" placeholder="What does it do?" /></Field>
          <Field label="Tech (comma-separated)"><input value={form.tech.join(', ')} onChange={(e) => setForm({ ...form, tech: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} className={inputCls} placeholder="TypeScript, React, Node.js" /></Field>
          <Field label="Image">
            <div className="flex gap-2">
              <input value={form.image ?? ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className={`${monoInputCls} flex-1`} placeholder="/images/projects/cover.png" />
              <button type="button" className="pixel-btn pixel-btn-cyan text-[9px] px-3 flex-shrink-0" onClick={() => fileRef.current?.click()}><Upload size={12} /></button>
            </div>
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub URL"><input value={form.links.github ?? ''} onChange={(e) => setForm({ ...form, links: { ...form.links, github: e.target.value } })} className={monoInputCls} placeholder="https://github.com/..." /></Field>
            <Field label="itch.io URL"><input value={form.links.itchio ?? ''} onChange={(e) => setForm({ ...form, links: { ...form.links, itchio: e.target.value } })} className={monoInputCls} placeholder="https://itch.io/..." /></Field>
            <Field label="Live Site URL"><input value={form.links.live ?? ''} onChange={(e) => setForm({ ...form, links: { ...form.links, live: e.target.value } })} className={monoInputCls} placeholder="https://..." /></Field>
            <Field label="Demo / Video URL"><input value={form.links.demo ?? ''} onChange={(e) => setForm({ ...form, links: { ...form.links, demo: e.target.value } })} className={monoInputCls} placeholder="https://youtube.com/..." /></Field>
            <Field label="Devpost URL"><input value={form.links.devpost ?? ''} onChange={(e) => setForm({ ...form, links: { ...form.links, devpost: e.target.value } })} className={monoInputCls} placeholder="https://devpost.com/..." /></Field>
            <Field label="Paper / Writeup URL"><input value={form.links.paper ?? ''} onChange={(e) => setForm({ ...form, links: { ...form.links, paper: e.target.value } })} className={monoInputCls} placeholder="https://..." /></Field>
          </div>
        </div>
      )}
    />
  )
}

// ── Achievements Tab ──────────────────────────────────────────────────────────

const emptyAchievement: Achievement = { id: '', title: '', description: '', image: '', url: '', date: '' }

function AchievementsTab(props: { token: string; saving: boolean; setSaving: (v: boolean) => void; setSaveMsg: (v: string) => void; uploadImage: (f: File, cb: (p: string) => void) => void }) {
  return (
    <JsonTab<Achievement>
      {...props}
      indexPath="public/achievements/index.json"
      color="neon-yellow"
      label="Achievement"
      emptyForm={emptyAchievement}
      renderListItem={(a) => (
        <>
          <div className="font-pixel text-[10px] text-neon-yellow mb-1 truncate">{a.title}</div>
          {a.date && <div className="font-mono text-xs text-pixel-dark">{a.date}</div>}
        </>
      )}
      renderForm={(form, setForm, fileRef) => (
        <div className="flex flex-col gap-4">
          <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Achievement name" /></Field>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light resize-y w-full" placeholder="What did you win/accomplish?" /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="URL (optional)"><input value={form.url ?? ''} onChange={(e) => setForm({ ...form, url: e.target.value })} className={monoInputCls} placeholder="https://devpost.com/..." /></Field>
            <Field label="Date (optional)"><input value={form.date ?? ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} placeholder="Nov 2025" /></Field>
          </div>
          <Field label="Image">
            <div className="flex gap-2">
              <input value={form.image ?? ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className={`${monoInputCls} flex-1`} placeholder="/images/achievements/cover.png" />
              <button type="button" className="pixel-btn pixel-btn-cyan text-[9px] px-3 flex-shrink-0" onClick={() => fileRef.current?.click()}><Upload size={12} /></button>
            </div>
          </Field>
        </div>
      )}
    />
  )
}

// ── Games Tab ─────────────────────────────────────────────────────────────────

const emptyGame: Game = { id: '', title: '', description: '', url: '', image: '', tech: [] }

function GamesTab(props: { token: string; saving: boolean; setSaving: (v: boolean) => void; setSaveMsg: (v: string) => void; uploadImage: (f: File, cb: (p: string) => void) => void }) {
  return (
    <JsonTab<Game>
      {...props}
      indexPath="public/games/index.json"
      color="neon-pink"
      label="Game"
      emptyForm={emptyGame}
      renderListItem={(g) => (
        <>
          <div className="font-pixel text-[10px] text-neon-pink mb-1 truncate">{g.title}</div>
          <div className="font-mono text-xs text-pixel-dark truncate">{g.url}</div>
        </>
      )}
      renderForm={(form, setForm, fileRef) => (
        <div className="flex flex-col gap-4">
          <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Game name" /></Field>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light resize-y w-full" placeholder="What is the game?" /></Field>
          <Field label="URL (itch.io, GitHub, etc.)"><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={monoInputCls} placeholder="https://yourname.itch.io/game" /></Field>
          <Field label="Tech (comma-separated)"><input value={form.tech.join(', ')} onChange={(e) => setForm({ ...form, tech: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} className={inputCls} placeholder="Godot, GDScript" /></Field>
          <Field label="Image">
            <div className="flex gap-2">
              <input value={form.image ?? ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className={`${monoInputCls} flex-1`} placeholder="/images/games/cover.png" />
              <button type="button" className="pixel-btn pixel-btn-cyan text-[9px] px-3 flex-shrink-0" onClick={() => fileRef.current?.click()}><Upload size={12} /></button>
            </div>
          </Field>
        </div>
      )}
    />
  )
}
