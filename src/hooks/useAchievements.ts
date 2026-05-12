import { useEffect, useState } from 'react'
import { sortByDateDesc } from '../lib/sortByDate'

export interface Achievement {
  id: string
  title: string
  description: string
  image?: string
  url?: string
  date?: string
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/achievements/index.json?' + Date.now())
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load achievements')
        return r.json()
      })
      .then((data: Achievement[]) => {
        setAchievements(sortByDateDesc(data))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { achievements, loading, error }
}
