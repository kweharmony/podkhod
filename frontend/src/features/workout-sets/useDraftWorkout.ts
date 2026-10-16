import { useState } from 'react'
import { workoutSets } from '@/shared/demo/demo'

export type DraftSet = {
  id: number
  weight: number
  reps: number
}

export type DraftExercise = {
  name: string
  sets: DraftSet[]
}

// Черновик тренировки из демо-данных: подходы первой тренировки по упражнениям.
// В ЛР №5 эти данные придут с сервера.
function initialDraft(): DraftExercise[] {
  const draft: DraftExercise[] = []

  for (const set of workoutSets.filter((item) => item.workoutId === 1)) {
    const exercise = draft.find((item) => item.name === set.exercise)
    const draftSet = { id: set.id, weight: set.weight, reps: set.reps }

    if (exercise) {
      exercise.sets.push(draftSet)
    } else {
      draft.push({ name: set.exercise, sets: [draftSet] })
    }
  }

  return draft
}

export function useDraftWorkout() {
  const [exercises, setExercises] = useState<DraftExercise[]>(initialDraft)

  // Меняем подходы одного упражнения, остальные оставляем как были
  function updateExercise(name: string, sets: DraftSet[]) {
    setExercises((previous) =>
      previous.map((exercise) => (exercise.name === name ? { ...exercise, sets } : exercise)),
    )
  }

  function addSet(name: string) {
    const exercise = exercises.find((item) => item.name === name)
    if (!exercise) return

    const last = exercise.sets.at(-1)
    updateExercise(name, [
      ...exercise.sets,
      { id: Date.now(), weight: last?.weight ?? 0, reps: last?.reps ?? 0 },
    ])
  }

  function removeSet(name: string, id: number) {
    const exercise = exercises.find((item) => item.name === name)
    if (!exercise) return

    updateExercise(
      name,
      exercise.sets.filter((set) => set.id !== id),
    )
  }

  function changeSet(name: string, id: number, field: 'weight' | 'reps', value: number) {
    const exercise = exercises.find((item) => item.name === name)
    if (!exercise) return

    updateExercise(
      name,
      exercise.sets.map((set) => (set.id === id ? { ...set, [field]: value } : set)),
    )
  }

  const volume = exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0),
    0,
  )

  return { exercises, volume, addSet, removeSet, changeSet }
}
