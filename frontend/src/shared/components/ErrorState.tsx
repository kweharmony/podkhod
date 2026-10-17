import { TriangleAlert } from 'lucide-react'
import { Button } from '@/shared/ui/button'

type Props = {
  text?: string
}

export default function ErrorState({ text = 'Не удалось загрузить данные' }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <TriangleAlert className="size-6 text-destructive" />
      <p className="text-sm text-muted-foreground">{text}</p>
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Попробовать снова
      </Button>
    </div>
  )
}
