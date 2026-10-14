import { useParams } from 'react-router-dom'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import EmptyState from '@/shared/components/EmptyState'
import { formatDate } from '@/shared/lib/format'
import { workoutSets, workouts } from '@/shared/demo/demo'

export default function WorkoutDetail() {
  const { id } = useParams()
  const workout = workouts.find((item) => item.id === Number(id))

  if (!workout) {
    return (
      <EmptyState
        title="Тренировка не найдена"
        backTo="/workouts"
        backLabel="К списку тренировок"
      />
    )
  }

  const sets = workoutSets.filter((set) => set.workoutId === workout.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{workout.title}</h1>
        <Badge variant="secondary">{formatDate(workout.date)}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        {workout.exercises} упражнения · объём {workout.volume} кг
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Подходы</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Упражнение</TableHead>
                <TableHead>Вес, кг</TableHead>
                <TableHead>Повторения</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sets.map((set) => (
                <TableRow key={set.id}>
                  <TableCell>{set.exercise}</TableCell>
                  <TableCell>{set.weight}</TableCell>
                  <TableCell>{set.reps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
