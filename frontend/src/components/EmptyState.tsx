import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

type Props = {
  title: string
  backTo: string
  backLabel: string
}

export default function EmptyState({ title, backTo, backLabel }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <Button asChild variant="outline">
        <Link to={backTo}>{backLabel}</Link>
      </Button>
    </div>
  )
}
