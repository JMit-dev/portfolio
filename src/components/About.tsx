import { motion } from 'framer-motion'
import { about, causes } from '../data/portfolio'

const causeColorMap: Record<string, { border: string; text: string }> = {
  'neon-red':    { border: 'border-red-500',    text: 'text-red-400' },
  'neon-yellow': { border: 'border-neon-yellow', text: 'text-neon-yellow' },
  'neon-green':  { border: 'border-neon-green',  text: 'text-neon-green' },
  'neon-orange': { border: 'border-orange-400',  text: 'text-orange-400' },
  'neon-cyan':   { border: 'border-neon-cyan',   text: 'text-neon-cyan' },
}

export default function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-heading"
        >
          About Me
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — Bio + Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {about.bio.split('\n\n').map((para, i) => (
              <p key={i} className="font-retro text-xl text-pixel-dim leading-relaxed mb-4">
                {para}
              </p>
            ))}

            <h3 className="font-pixel text-[11px] text-neon-cyan mt-6 mb-4">&gt; Tech Stack</h3>
            <div className="grid grid-cols-2 gap-2">
              {(about.skills as string[]).map((skill) => (
                <div key={skill} className="flex items-center gap-2 font-retro text-lg text-pixel-dim">
                  <span className="text-neon-green">▶</span>
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Causes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-pixel text-[11px] text-neon-pink mb-4">&gt; Causes I Support</h3>
            <div className="flex flex-col gap-3">
              {causes.map((cause, i) => {
                const colors = causeColorMap[cause.color] ?? causeColorMap['neon-green']
                return (
                  <motion.a
                    key={cause.name}
                    href={cause.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * i }}
                    className={`block pixel-card p-4 border ${colors.border} group transition-all`}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '4px 4px 0px currentColor')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{cause.icon}</span>
                      <div>
                        <div className={`font-pixel text-[10px] ${colors.text} mb-1 group-hover:underline`}>
                          {cause.name}
                        </div>
                        <div className="font-retro text-lg text-pixel-dim leading-snug">
                          {cause.description}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
