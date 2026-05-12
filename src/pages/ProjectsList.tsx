import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { ExternalLink, ArrowLeft, FolderOpen } from 'lucide-react'
import { GithubIcon } from '../components/SocialIcons'

function ItchioIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 245.371 220.736" fill="currentColor" aria-hidden="true">
      <path d="M31.99 1.365C21.987 7.72 0 34.192 0 40.389v10.276c0 12.454 11.86 23.3 22.792 23.3 12.93 0 23.684-10.806 23.684-23.702 0 12.896 10.42 23.702 23.35 23.702 12.93 0 23.348-10.806 23.348-23.702 0 12.896 10.754 23.702 23.684 23.702h.084c12.93 0 23.686-10.806 23.686-23.702 0 12.896 10.42 23.702 23.348 23.702 12.93 0 23.35-10.806 23.35-23.702 0 12.896 10.756 23.702 23.686 23.702 10.93 0 22.792-10.846 22.792-23.3V40.39c0-6.197-21.987-32.67-31.988-39.025C220.678.049 23.013.049 31.99 1.365zm80.594 66.18c-3.96 0-7.714 1.58-10.523 4.37-2.81 2.79-4.39 6.61-4.39 10.59v26.06H89.24v-24.91c-.002-5.98-2.32-11.72-6.43-15.95-4.112-4.23-9.686-6.6-15.498-6.6-5.813 0-11.387 2.37-15.499 6.6-4.112 4.23-6.43 9.97-6.43 15.95v24.91H30.52V78.87c.04-4.9-2.36-9.5-6.36-12.36h37.26c4.63 0 8.39 3.77 8.39 8.42v15.6h26.7V75.93c0-4.65 3.77-8.42 8.39-8.42h15.21c4.63 0 8.39 3.77 8.39 8.42v15.6h26.7v-15.6c0-4.65 3.76-8.42 8.39-8.42h37.26c-4 2.86-6.4 7.46-6.36 12.36v24.91H181.9v-24.91c0-5.98-2.32-11.72-6.43-15.95-4.112-4.23-9.686-6.6-15.499-6.6s-11.387 2.37-15.499 6.6c-4.11 4.23-6.43 9.97-6.43 15.95v24.91h-20.43V78.05c0-3.98-1.58-7.8-4.39-10.59-2.81-2.79-6.56-4.37-10.52-4.37h-.114zm-68.47 78.3v41.02h163.48v-41.02l-16.32 16.32H44.434l-16.32-16.32z"/>
    </svg>
  )
}

const colorCycle = ['green', 'cyan', 'pink', 'yellow'] as const
type Color = typeof colorCycle[number]
const colorMap: Record<Color, { badge: string; text: string; shadow: string }> = {
  green:  { badge: 'badge-green', text: 'text-neon-green',  shadow: '4px 4px 0px #00ff87' },
  cyan:   { badge: 'badge',       text: 'text-neon-cyan',   shadow: '4px 4px 0px #00e5ff' },
  pink:   { badge: 'badge-pink',  text: 'text-neon-pink',   shadow: '4px 4px 0px #ff00ff' },
  yellow: { badge: 'badge-yellow',text: 'text-neon-yellow', shadow: '4px 4px 0px #ffd700' },
}

export default function ProjectsList() {
  const { projects, loading } = useProjects()

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-5xl mx-auto py-12">
        <Link to="/#projects" className="inline-flex items-center gap-2 font-pixel text-[9px] text-pixel-dim hover:text-neon-green transition-colors mb-8">
          <ArrowLeft size={12} /> Back
        </Link>
        <h1 className="font-pixel text-base neon-text-green mb-10">
          All Projects<span className="animate-blink">_</span>
        </h1>

        {loading && <p className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading...</p>}
        {!loading && projects.length === 0 && (
          <div className="pixel-card p-10 text-center">
            <FolderOpen size={36} className="text-neon-green mx-auto mb-4 opacity-40" />
            <p className="font-retro text-xl text-pixel-dim">No projects yet.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, i) => {
            const c = colorMap[colorCycle[i % colorCycle.length]]
            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="pixel-card flex flex-col group border-bg-border"
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = c.shadow)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
              >
                {proj.image && (
                  <div className="relative overflow-hidden border-b-2 border-bg-border">
                    <img src={proj.image} alt={proj.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-pixel text-[9px] ${c.text} leading-relaxed`}>{proj.title}</h3>
                    {proj.date && <span className="font-mono text-xs text-pixel-dark flex-shrink-0">{proj.date}</span>}
                  </div>
                  <p className="font-retro text-lg text-pixel-dim leading-snug mb-4 flex-1">{proj.description}</p>
                  {proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tech.map((t) => <span key={t} className={`badge ${c.badge} text-[10px]`}>{t}</span>)}
                    </div>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    {proj.links.github && <a href={proj.links.github} target="_blank" rel="noopener noreferrer" className={`text-pixel-dim hover:${c.text} transition-colors`}><GithubIcon size={15} /></a>}
                    {proj.links.itchio && <a href={proj.links.itchio} target="_blank" rel="noopener noreferrer" className="text-pixel-dim hover:text-neon-pink transition-colors"><ItchioIcon size={15} /></a>}
                    {proj.links.live && <a href={proj.links.live} target="_blank" rel="noopener noreferrer" className={`text-pixel-dim hover:${c.text} transition-colors`}><ExternalLink size={14} /></a>}
                    {proj.links.demo && <a href={proj.links.demo} target="_blank" rel="noopener noreferrer" className={`font-pixel text-[8px] ${c.text} hover:underline`}>demo</a>}
                    {proj.links.devpost && <a href={proj.links.devpost} target="_blank" rel="noopener noreferrer" className="font-pixel text-[8px] text-neon-cyan hover:underline">devpost</a>}
                    {proj.links.paper && <a href={proj.links.paper} target="_blank" rel="noopener noreferrer" className="font-pixel text-[8px] text-neon-yellow hover:underline">paper</a>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
