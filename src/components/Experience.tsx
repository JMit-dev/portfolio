import { motion } from 'framer-motion'
import { experience } from '../data/portfolio'
import { ExternalLink } from 'lucide-react'

export default function Experience() {
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
          {/* Vertical timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-neon-green via-neon-cyan to-neon-pink opacity-30 hidden sm:block ml-4" />

          <div className="flex flex-col gap-10">
            {experience.map((job, ji) => (
              <motion.div
                key={job.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ji * 0.15 }}
                className="sm:pl-12 relative"
              >
                {/* Timeline dot */}
                <div className="hidden sm:block absolute left-0 top-1 w-9 h-9 border-2 border-neon-green bg-bg-secondary flex items-center justify-center">
                  <div className="w-2 h-2 bg-neon-green" />
                </div>

                {/* Company header */}
                <a
                  href={job.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-pixel text-[11px] text-neon-cyan hover:text-neon-green transition-colors mb-4 group"
                >
                  {job.company}
                  <ExternalLink size={10} className="opacity-50 group-hover:opacity-100" />
                </a>

                {/* Positions */}
                <div className="flex flex-col gap-4">
                  {job.positions.map((pos, pi) => (
                    <div
                      key={pos.title}
                      className={`pixel-card p-5 ${pi === 0 ? 'border-neon-green/30' : 'border-bg-border'}`}
                    >
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
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
