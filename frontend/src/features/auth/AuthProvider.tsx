import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './context'
import { apiFetch, clearToken, refresh, type User } from './api'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    refresh().then(() => apiFetch('/auth/me')).then((response) => response.json())
      .then((data: User) => { if (active) setUser(data) })
      .catch(() => { clearToken() })
      .finally(() => { if (active) setLoading(false) })
    function expired() { setUser(null) }
    window.addEventListener('session-expired', expired)
    return () => {
      active = false
      window.removeEventListener('session-expired', expired)
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>
}
