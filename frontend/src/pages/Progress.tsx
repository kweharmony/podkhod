import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import ProgressChart from '@/entities/progress/ProgressChart'
import ErrorState from '@/shared/components/ErrorState'
import Loading from '@/shared/components/Loading'
import NoData from '@/shared/components/NoData'
import { useDemoData } from '@/shared/lib/useDemoData'
import { exerciseProgress, exercises } from '@/shared/demo/demo'

export default function Progress() {
  const [searchParams, setSearchParams] = useSearchParams()
  const exerciseId = searchParams.get('exercise') ?? String(exercises[0].id)
  const exercise = exercises.find((item) => String(item.id) === exerciseId) ?? exercises[0]

  const { data, loading, error } = useDemoData(exerciseProgress)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Прогресс</h1>

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
          {loading && <Loading text="Считаем прогресс..." />}
          {error && <ErrorState text="Не удалось загрузить историю упражнения" />}
          {!loading && !error && data.length === 0 && (
            <NoData text="По этому упражнению ещё нет подходов" />
          )}
          {!loading && !error && data.length > 0 && <ProgressChart data={data} />}
        </CardContent>
      </Card>
    </div>
  )
}
