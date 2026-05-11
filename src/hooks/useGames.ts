import { useEffect, useState } from 'react'

export interface Game {
  id: string
  title: string
  description: string
  url: string
  image?: string
  tech: string[]
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/games/index.json?' + Date.now())
      .then((r) => r.json())
      .then((data: Game[]) => { setGames(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return { games, loading }
}
