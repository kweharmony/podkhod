import { Link } from 'react-router-dom'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import type { Exercise } from '@/entities/types'

type Props = {
  exercise: Exercise
}

export default function ExerciseCard({ exercise }: Props) {
  return (
    <Link to={`/exercises/${exercise.id}`}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">{exercise.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">{exercise.bodyPart}</Badge>
          <Badge variant="outline">{exercise.equipment}</Badge>
        </CardContent>
      </Card>
    </Link>
  )
}
