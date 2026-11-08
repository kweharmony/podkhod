import { useSearchParams } from 'react-router-dom'
import { loadWorkouts } from '@/entities/api'
import ProgressChart from '@/entities/progress/ProgressChart'
import { useResource } from '@/shared/lib/useResource'
import ResourceState from '@/shared/components/ResourceState'
export default function Progress() {
  const { data, loading, error } = useResource(loadWorkouts)
  const [params, setParams] = useSearchParams()
  const exercises = new Map(
    data?.flatMap((w) =>
      w.exercises.map((e) => [e.exercise.id, e.exercise.name] as const),
    ),
  )
  const id = Number(params.get('exercise') ?? [...exercises.keys()][0])
  const points = (data ?? [])
    .filter((w) =>
      w.exercises.some((e) => e.exercise.id === id && e.sets.length),
    )
    .map((w) => {
      const items = w.exercises.filter((e) => e.exercise.id === id)
      return {
        date: w.date,
        weight: Math.max(...items.flatMap((e) => e.sets.map((s) => s.weight))),
        oneRm: Math.max(...items.map((e) => e.one_rep_max ?? 0)),
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Прогресс</h1>
      <ResourceState loading={loading} error={error} />
      {exercises.size > 0 && (
        <label>
          Упражнение{' '}
          <select
            className="rounded border p-2"
            value={id}
            onChange={(e) => setParams({ exercise: e.target.value })}
          >
            {[...exercises].map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
      )}
      {!loading &&
        !error &&
        (points.length ? (
          <ProgressChart data={points} />
        ) : (
          <p>Для графика запишите подходы в тренировках</p>
        ))}
    </div>
  )
}
