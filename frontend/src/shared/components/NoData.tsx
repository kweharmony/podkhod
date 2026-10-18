import { Link } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { Button } from '@/shared/ui/button'

type Props = {
  text: string
  backTo?: string
  backLabel?: string
}

// Данных нет: пустой список, не найденная запись или ничего по фильтрам
export default function NoData({ text, backTo, backLabel }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Inbox className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{text}</p>
      {backTo && (
        <Button asChild variant="outline" size="sm">
          <Link to={backTo}>{backLabel}</Link>
        </Button>
      )}
    </div>
  )
}
