import { useEffect, useState } from 'react'

export interface ProjectLinks {
  github?: string
  itchio?: string
  live?: string
  demo?: string
  devpost?: string
  paper?: string
}

export interface Project {
  id: string
  title: string
  description: string
  image?: string
  tech: string[]
  links: ProjectLinks
  featured?: boolean
  date?: string
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/projects/index.json?' + Date.now())
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load projects')
        return r.json()
      })
      .then((data: Project[]) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { projects, loading, error }
}
