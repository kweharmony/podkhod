import { Link, useNavigate } from 'react-router-dom'
import { Check, Plus, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { useDraftWorkout } from '@/features/workout-sets/useDraftWorkout'

export default function WorkoutNew() {
  const navigate = useNavigate()
  const { exercises, volume, addSet, removeSet, changeSet } = useDraftWorkout()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Новая тренировка</h1>
        <Button asChild variant="outline">
          <Link to="/exercises">
            <Plus />
            Добавить упражнение
          </Link>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">Объём: {volume} кг</p>

      <div className="space-y-4">
        {exercises.map((exercise) => (
          <Card key={exercise.name}>
            <CardHeader>
              <CardTitle className="text-base">{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {exercise.sets.map((set, index) => (
                <div key={set.id} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-muted-foreground">{index + 1}</span>
                  <Input
                    className="w-24"
                    type="number"
                    value={set.weight}
                    onChange={(event) =>
                      changeSet(exercise.name, set.id, 'weight', Number(event.target.value))
                    }
                  />
                  <span className="text-muted-foreground">кг ×</span>
                  <Input
                    className="w-24"
                    type="number"
                    value={set.reps}
                    onChange={(event) =>
                      changeSet(exercise.name, set.id, 'reps', Number(event.target.value))
                    }
                  />
                  <span className="text-muted-foreground">повт.</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Удалить подход"
                    onClick={() => removeSet(exercise.name, set.id)}
                  >
                    <X />
                  </Button>
                </div>
              ))}

              {exercise.sets.length === 0 && (
                <p className="text-sm text-muted-foreground">Подходов пока нет</p>
              )}

              <Button variant="ghost" size="sm" onClick={() => addSet(exercise.name)}>
                <Plus />
                Добавить подход
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={() => navigate('/workouts')}>
        <Check />
        Завершить тренировку
      </Button>
    </div>
  )
}
