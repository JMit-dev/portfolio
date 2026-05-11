import { motion } from 'framer-motion'
import { useAchievements } from '../hooks/useAchievements'
import { Trophy, ExternalLink } from 'lucide-react'

export default function Achievements() {
  const { achievements, loading } = useAchievements()

  return (
    <section id="achievements" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-heading"
          style={{ color: '#ffd700', textShadow: '0 0 8px rgba(255,215,0,0.6)' }}
        >
          Achievements
        </motion.h2>

        {loading && (
          <p className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading achievements...</p>
        )}

        {!loading && achievements.length === 0 && (
          <div className="pixel-card p-10 text-center border-neon-yellow/20">
            <Trophy size={36} className="text-neon-yellow mx-auto mb-4 opacity-40" />
            <p className="font-pixel text-[9px] text-neon-yellow mb-2">NONE YET</p>
            <p className="font-retro text-xl text-pixel-dim">Achievements will appear here once added.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="pixel-card flex flex-col border-neon-yellow/30 group"
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '4px 4px 0px #ffd700')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
            >
              {ach.image && (
                <div className="overflow-hidden border-b-2 border-bg-border">
                  <img
                    src={ach.image}
                    alt={ach.title}
                    className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 border-2 border-neon-yellow flex items-center justify-center flex-shrink-0">
                    <Trophy size={16} className="text-neon-yellow" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-pixel text-[9px] text-neon-yellow leading-relaxed">
                        {ach.title}
                      </h3>
                      {ach.url && (
                        <a href={ach.url} target="_blank" rel="noopener noreferrer"
                          className="text-pixel-dim hover:text-neon-yellow transition-colors flex-shrink-0">
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    {ach.date && (
                      <span className="font-mono text-xs text-pixel-dark">{ach.date}</span>
                    )}
                  </div>
                </div>
                <p className="font-retro text-lg text-pixel-dim leading-snug">{ach.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
