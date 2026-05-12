import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useGames } from '../hooks/useGames'
import { Gamepad2, ExternalLink, ArrowLeft } from 'lucide-react'

export default function GamesList() {
  const { games, loading } = useGames()

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-5xl mx-auto py-12">
        <Link to="/#games" className="inline-flex items-center gap-2 font-pixel text-[9px] text-pixel-dim hover:text-neon-pink transition-colors mb-8">
          <ArrowLeft size={12} /> Back
        </Link>
        <h1 className="font-pixel text-base mb-10" style={{ color: '#ff00ff', textShadow: '0 0 8px rgba(255,0,255,0.6)' }}>
          All Games<span className="animate-blink">_</span>
        </h1>

        {loading && <p className="font-pixel text-[9px] text-pixel-dim animate-pulse">&gt; Loading...</p>}
        {!loading && games.length === 0 && (
          <div className="pixel-card p-10 text-center border-neon-pink/20">
            <Gamepad2 size={40} className="text-neon-pink mx-auto mb-4 opacity-50" />
            <p className="font-pixel text-[9px] text-neon-pink mb-2">INSERT COIN</p>
            <p className="font-retro text-xl text-pixel-dim">Games coming soon!</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <motion.a
              key={game.id}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="block pixel-card pixel-card-pink flex flex-col group"
            >
              {game.image && (
                <div className="overflow-hidden border-b-2 border-bg-border">
                  <img src={game.image} alt={game.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-pixel text-[9px] text-neon-pink leading-relaxed">{game.title}</h3>
                  <ExternalLink size={12} className="text-pixel-dim flex-shrink-0 mt-0.5" />
                </div>
                {game.date && <span className="font-mono text-xs text-pixel-dark mb-2">{game.date}</span>}
                <p className="font-retro text-lg text-pixel-dim leading-snug mb-3 flex-1">{game.description}</p>
                {game.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {game.tech.map((t) => <span key={t} className="badge badge-pink text-[10px]">{t}</span>)}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
}
