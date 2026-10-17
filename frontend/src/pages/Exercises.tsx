import { useState } from 'react'
import ExerciseCard from '@/entities/exercise/ExerciseCard'
import ExerciseFilters from '@/features/exercise-filter/ExerciseFilters'
import { emptyFilters, filterExercises } from '@/features/exercise-filter/filter'
import ErrorState from '@/shared/components/ErrorState'
import Loading from '@/shared/components/Loading'
import NoData from '@/shared/components/NoData'
import { useDemoData } from '@/shared/lib/useDemoData'
import { exercises } from '@/shared/demo/demo'

export default function Exercises() {
  const [filters, setFilters] = useState(emptyFilters)
  const { data, loading, error } = useDemoData(exercises)
  const visible = filterExercises(data, filters)

  if (loading) return <Loading text="Загружаем справочник..." />
  if (error) return <ErrorState text="Не удалось загрузить справочник упражнений" />

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Упражнения</h1>

      <ExerciseFilters filters={filters} onChange={setFilters} />

      {visible.length === 0 ? (
        <NoData text="Ничего не найдено. Попробуйте изменить фильтры." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  )
}
