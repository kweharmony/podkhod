import { useState } from 'react'
import ExerciseCard from '@/entities/exercise/ExerciseCard'
import ExerciseFilters from '@/features/exercise-filter/ExerciseFilters'
import { emptyFilters, filterExercises } from '@/features/exercise-filter/filter'
import { exercises } from '@/shared/demo/demo'

export default function Exercises() {
  const [filters, setFilters] = useState(emptyFilters)
  const visible = filterExercises(exercises, filters)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Упражнения</h1>

      <ExerciseFilters filters={filters} onChange={setFilters} />

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Ничего не найдено. Попробуйте изменить фильтры.
        </p>
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
