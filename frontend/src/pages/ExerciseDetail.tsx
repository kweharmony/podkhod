import { useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/EmptyState'
import { exercises } from '@/data/demo'

export default function ExerciseDetail() {
  const { id } = useParams()
  const exercise = exercises.find((item) => item.id === Number(id))

  if (!exercise) {
    return (
      <EmptyState
        title="Упражнение не найдено"
        backTo="/exercises"
        backLabel="К справочнику"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{exercise.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{exercise.bodyPart}</Badge>
          <Badge variant="outline">{exercise.equipment}</Badge>
          <Badge variant="outline">{exercise.target}</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Техника</CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Здесь будет GIF из датасета
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Инструкция</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Займите исходное положение.</p>
            <p>2. Выполните движение с контролем.</p>
            <p>3. Вернитесь в исходное положение.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
