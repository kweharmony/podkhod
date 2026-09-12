import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6">
      <p className="text-6xl font-semibold tracking-tight">404</p>
      <p className="text-muted-foreground">Такой страницы нет</p>
      <Button asChild>
        <Link to="/">На главную</Link>
      </Button>
    </div>
  )
}
