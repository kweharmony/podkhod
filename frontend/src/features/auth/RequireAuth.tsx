import { Navigate, Outlet } from 'react-router-dom'
import Loading from '@/shared/components/Loading'
import { useAuth } from './context'

export default function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
