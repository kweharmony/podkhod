import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import { workouts } from '@/data/demo'

export default function Workouts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Тренировки</h1>
        <Button asChild>
          <Link to="/workouts/new">
            <Plus />
            Новая тренировка
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {workouts.map((workout) => (
          <Link key={workout.id} to={`/workouts/${workout.id}`} className="block">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{workout.title}</CardTitle>
                <Badge variant="secondary">{formatDate(workout.date)}</Badge>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {workout.exercises} упражнения · объём {workout.volume} кг
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
