import { Inbox } from 'lucide-react'

type Props = {
  text: string
}

export default function NoData({ text }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Inbox className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
