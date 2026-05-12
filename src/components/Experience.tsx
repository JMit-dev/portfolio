import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { experience } from '../data/portfolio'
import { ExternalLink } from 'lucide-react'

export default function Experience() {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set([experience[0].company])
  )

  const toggle = (company: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(company)) next.delete(company)
      else next.add(company)
      return next
    })
  }

  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-heading"
        >
          Experience
        </motion.h2>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-neon-green via-neon-cyan to-neon-pink opacity-30 hidden sm:block ml-4" />

          <div className="flex flex-col gap-6">
            {experience.map((job, ji) => {
              const isOpen = expanded.has(job.company)
              return (
                <motion.div
                  key={job.company}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ji * 0.1 }}
                  className="sm:pl-12 relative"
                >
                  {/* Timeline dot — filled when open, hollow when closed */}
                  <button
                    onClick={() => toggle(job.company)}
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                    className="hidden sm:flex absolute left-0 top-1 w-9 h-9 border-2 items-center justify-center transition-colors duration-150 focus:outline-none"
                    style={{
                      borderColor: isOpen ? '#00ff87' : '#2a2a3a',
                      background: isOpen ? 'rgba(0,255,135,0.12)' : '#12121a',
                    }}
                  >
                    <div
                      className="w-3 h-3 transition-all duration-150"
                      style={{ background: isOpen ? '#00ff87' : '#2a2a3a' }}
                    />
                  </button>

                  {/* Company header — also clickable */}
                  <button
                    onClick={() => toggle(job.company)}
                    className="flex items-center gap-2 mb-1 group text-left w-full"
                  >
                    <span
                      className="font-pixel text-[11px] transition-colors duration-150"
                      style={{ color: isOpen ? '#00e5ff' : '#444466' }}
                    >
                      {job.company}
                    </span>
                    {job.companyUrl && (
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-pixel-dark hover:text-neon-cyan transition-colors"
                      >
                        <ExternalLink size={10} />
                      </a>
                    )}
                    <span
                      className="font-pixel text-[8px] ml-auto transition-colors duration-150"
                      style={{ color: isOpen ? '#00ff87' : '#444466' }}
                    >
                      {isOpen ? '▼' : '▶'}
                    </span>
                  </button>

                  {/* Positions — animated */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-4 pt-2">
                          {job.positions.map((pos) => (
                            <div key={pos.title} className="pixel-card p-5 border-neon-green/20">
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                                <span className="font-pixel text-[10px] text-neon-green">{pos.title}</span>
                                <span className="font-mono text-xs text-pixel-dark bg-bg-border px-2 py-0.5">
                                  {pos.period}
                                </span>
                              </div>
                              <ul className="flex flex-col gap-2">
                                {pos.bullets.map((bullet, bi) => (
                                  <li key={bi} className="flex items-start gap-2 font-retro text-lg text-pixel-dim leading-snug">
                                    <span className="text-neon-green mt-0.5 flex-shrink-0">▸</span>
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
