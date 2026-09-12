import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { workoutSets } from '@/data/demo'
import type { WorkoutSet } from '@/types'

// Демо-тренировка: подходы первой тренировки, сгруппированные по упражнению
const groups = workoutSets
  .filter((set) => set.workoutId === 1)
  .reduce<Record<string, WorkoutSet[]>>((acc, set) => {
    acc[set.exercise] = [...(acc[set.exercise] ?? []), set]
    return acc
  }, {})

export default function WorkoutNew() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Новая тренировка</h1>
        <Button variant="outline">
          <Plus />
          Добавить упражнение
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(groups).map(([name, sets]) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle className="text-base">{name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sets.map((set, index) => (
                <div key={set.id} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-muted-foreground">{index + 1}</span>
                  <Input className="w-24" defaultValue={set.weight} />
                  <span className="text-muted-foreground">кг ×</span>
                  <Input className="w-24" defaultValue={set.reps} />
                  <span className="text-muted-foreground">повт.</span>
                </div>
              ))}
              <Button variant="ghost" size="sm">
                <Plus />
                Добавить подход
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button>
        <Check />
        Завершить тренировку
      </Button>
    </div>
  )
}
