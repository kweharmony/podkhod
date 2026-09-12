import { Link } from 'react-router-dom'
import { ChevronRight, Dumbbell, Plus, Scale, Weight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '@/components/StatCard'
import VolumeChart from '@/components/VolumeChart'
import { formatDate } from '@/lib/format'
import { measurements, workouts } from '@/data/demo'

export default function Dashboard() {
  const weekWorkouts = workouts.slice(0, 2)
  const weekVolume = weekWorkouts.reduce((sum, workout) => sum + workout.volume, 0)
  const lastWorkout = workouts[0]
  const [lastMeasurement, previousMeasurement] = measurements
  const weightDiff = (lastMeasurement.weight - previousMeasurement.weight).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Дашборд</h1>
        <Button asChild>
          <Link to="/workouts/new">
            <Plus />
            Начать тренировку
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Тренировок за неделю" value={weekWorkouts.length} icon={Dumbbell} />
        <StatCard title="Объём за неделю, кг" value={weekVolume} icon={Weight} />
        <StatCard
          title="Вес тела, кг"
          value={lastMeasurement.weight}
          icon={Scale}
          hint={`${weightDiff} за неделю`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Объём по тренировкам</CardTitle>
          </CardHeader>
          <CardContent>
            <VolumeChart workouts={workouts} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Последняя тренировка</CardTitle>
            <Badge variant="secondary">{formatDate(lastWorkout.date)}</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">{lastWorkout.title}</p>
            <p className="text-sm text-muted-foreground">
              {lastWorkout.exercises} упражнения · {lastWorkout.volume} кг
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to={`/workouts/${lastWorkout.id}`}>Открыть</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">История тренировок</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/workouts">Все тренировки</Link>
          </Button>
        </CardHeader>
        <CardContent className="divide-y">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              to={`/workouts/${workout.id}`}
              className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0"
            >
              <span className="font-medium">{workout.title}</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                {formatDate(workout.date)} · {workout.volume} кг
                <ChevronRight className="size-4" />
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
