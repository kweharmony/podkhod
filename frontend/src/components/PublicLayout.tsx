import { Link, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3">
          <Link to="/">
            <img src="/favicon.png" alt="Podkhod" className="h-8 w-8" />
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Войти</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Регистрация</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6">
        <Outlet />
      </main>
    </div>
  )
}
