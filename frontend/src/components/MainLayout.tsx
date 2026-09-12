import { Link, NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Дашборд' },
  { to: '/workouts', label: 'Тренировки' },
  { to: '/exercises', label: 'Упражнения' },
  { to: '/progress', label: 'Прогресс' },
  { to: '/measurements', label: 'Замеры' },
]

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-6 py-3">
          <Link to="/" className="font-semibold">
            Фитнес-ассистент
          </Link>

          <nav className="flex gap-4 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/login" className="ml-auto text-sm text-muted-foreground">
            Вход
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
