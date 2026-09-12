import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string
  value: string | number
  icon?: LucideIcon
  hint?: string
}

export default function StatCard({ title, value, icon: Icon, hint }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
          {Icon && <Icon className="size-4" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold">{value}</span>
        {hint && <span className="text-sm text-muted-foreground">{hint}</span>}
      </CardContent>
    </Card>
  )
}
