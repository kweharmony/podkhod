import { useState } from 'react'
import { logout } from '@/features/auth/api'
import { useAuth } from '@/features/auth/context'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Dumbbell, LayoutDashboard, LogIn, Ruler, TrendingUp } from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { to: '/workouts', label: 'Тренировки', icon: Dumbbell },
  { to: '/exercises', label: 'Упражнения', icon: BookOpen },
  { to: '/progress', label: 'Прогресс', icon: TrendingUp },
  { to: '/measurements', label: 'Замеры', icon: Ruler },
]

export default function MainLayout() {
  const { setUser } = useAuth()
  const [error, setError] = useState('')
  async function signOut() {
    try {
      await logout()
      setUser(null)
    } catch {
      setError('Не удалось выйти. Попробуйте снова')
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-3 sm:gap-8">
          <Link to="/dashboard">
            <img src="/favicon.png" alt="Podkhod" className="h-8 w-8" />
          </Link>

          <nav className="flex gap-3 text-sm sm:gap-4">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          <button onClick={signOut} className="ml-auto flex items-center gap-1.5 text-sm">
            <LogIn className="size-4" /> Выйти
          </button>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
