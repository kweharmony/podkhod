import { useEffect, useState } from 'react'

export function useResource<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  useEffect(() => {
    let active = true
    load()
      .then((value) => {
        if (active) {
          setData(value)
          setError('')
        }
      })
      .catch((error: Error) => {
        if (active) { setData(null); setError(error.message) }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [load, version])
  return {
    data,
    loading,
    error,
    reload: () => setVersion((value) => value + 1),
  }
}
