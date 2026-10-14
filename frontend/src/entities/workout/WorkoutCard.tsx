import { Link } from 'react-router-dom'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { formatDate } from '@/shared/lib/format'
import type { Workout } from '@/entities/types'

type Props = {
  workout: Workout
}

export default function WorkoutCard({ workout }: Props) {
  return (
    <Link to={`/workouts/${workout.id}`} className="block">
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
  )
}
