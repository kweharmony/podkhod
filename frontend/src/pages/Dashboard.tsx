import { Link } from 'react-router-dom'
import { Dumbbell, Plus, Scale, Weight } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import StatCard from '@/shared/components/StatCard'
import VolumeChart from '@/entities/progress/VolumeChart'
import ErrorState from '@/shared/components/ErrorState'
import Loading from '@/shared/components/Loading'
import NoData from '@/shared/components/NoData'
import { useDemoData } from '@/shared/lib/useDemoData'
import { formatDate } from '@/shared/lib/format'
import { measurements, workouts } from '@/shared/demo/demo'

export default function Dashboard() {
  const { data, loading, error } = useDemoData(workouts)

  const weekWorkouts = data.slice(0, 2)
  const weekVolume = weekWorkouts.reduce((sum, workout) => sum + workout.volume, 0)
  const lastWorkout = data[0]
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

      {loading && <Loading />}
      {error && <ErrorState />}
      {!loading && !error && !lastWorkout && (
        <NoData text="Тренировок пока нет, поэтому и считать нечего." />
      )}

      {!loading && !error && lastWorkout && (
        <>
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
                <VolumeChart workouts={data} />
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
        </>
      )}
    </div>
  )
}
