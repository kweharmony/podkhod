import type { Exercise } from '@/entities/types'

export const ALL = 'Все'

export type Filters = {
  query: string
  bodyPart: string
  equipment: string
}

export const emptyFilters: Filters = { query: '', bodyPart: ALL, equipment: ALL }

// Отбор упражнений по фильтрам. Живёт рядом с самими фильтрами, чтобы страница
// не повторяла условия у себя.
export function filterExercises(exercises: Exercise[], filters: Filters) {
  return exercises.filter(
    (exercise) =>
      (filters.bodyPart === ALL || exercise.bodyPart === filters.bodyPart) &&
      (filters.equipment === ALL || exercise.equipment === filters.equipment) &&
      exercise.name.toLowerCase().includes(filters.query.toLowerCase()),
  )
}
