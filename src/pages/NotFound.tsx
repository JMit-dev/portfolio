import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="font-pixel text-6xl neon-text-green">404</div>
      <div className="font-pixel text-xs text-neon-cyan">GAME OVER</div>
      <p className="font-retro text-2xl text-pixel-dim max-w-sm">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link to="/" className="pixel-btn">
        <Home size={13} /> Go Home
      </Link>
    </div>
  )
}
