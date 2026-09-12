import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StatCard from '@/components/StatCard'
import ProgressChart from '@/components/ProgressChart'
import { exerciseProgress, exercises, workouts } from '@/data/demo'

export default function Progress() {
  const [searchParams, setSearchParams] = useSearchParams()
  const exerciseId = searchParams.get('exercise') ?? String(exercises[0].id)
  const exercise = exercises.find((item) => String(item.id) === exerciseId) ?? exercises[0]

  const totalVolume = workouts.reduce((sum, workout) => sum + workout.volume, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Прогресс</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Тренировок за месяц" value={workouts.length} />
        <StatCard title="Суммарный объём, кг" value={totalVolume} />
        <StatCard
          title="Средний объём, кг"
          value={Math.round(totalVolume / workouts.length)}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{exercise.name}: вес и расчётный 1RM</CardTitle>
          <Select
            value={exerciseId}
            onValueChange={(value) => setSearchParams({ exercise: value })}
          >
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ProgressChart data={exerciseProgress} />
        </CardContent>
      </Card>
    </div>
  )
}
