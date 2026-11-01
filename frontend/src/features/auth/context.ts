import { createContext, useContext } from 'react'
import type { User } from './api'

export const AuthContext = createContext<{
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}>({ user: null, loading: true, setUser: () => {} })

export function useAuth() { return useContext(AuthContext) }
