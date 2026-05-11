import { motion } from 'framer-motion'
import { games } from '../data/portfolio'
import { Gamepad2, ExternalLink } from 'lucide-react'

export default function Games() {
  return (
    <section id="games" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-heading"
          style={{ color: '#ff00ff', textShadow: '0 0 8px rgba(255,0,255,0.6)' }}
        >
          Games
        </motion.h2>

        {games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pixel-card p-10 text-center border-neon-pink/30"
          >
            <Gamepad2 size={40} className="text-neon-pink mx-auto mb-4 opacity-50" />
            <p className="font-pixel text-[10px] text-neon-pink mb-2">INSERT COIN</p>
            <p className="font-retro text-xl text-pixel-dim">
              Games coming soon. Check back later, or{' '}
              <a
                href="https://github.com/JMit-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:underline"
              >
                follow on GitHub
              </a>{' '}
              for updates!
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, i) => (
              <motion.a
                key={game.title}
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="pixel-card pixel-card-pink flex flex-col group"
              >
                {game.image && (
                  <div className="overflow-hidden border-b-2 border-bg-border">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-pixel text-[9px] text-neon-pink leading-relaxed">{game.title}</h3>
                    <ExternalLink size={12} className="text-pixel-dim flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="font-retro text-lg text-pixel-dim leading-snug mb-3 flex-1">{game.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {game.tech.map((t) => (
                      <span key={t} className="badge badge-pink text-[10px]">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
