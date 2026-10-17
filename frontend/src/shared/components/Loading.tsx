import { Loader2 } from 'lucide-react'

type Props = {
  text?: string
}

export default function Loading({ text = 'Загружаем...' }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {text}
    </div>
  )
}
