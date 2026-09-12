import type { Exercise, Measurement, ProgressPoint, Workout, WorkoutSet } from '@/types'

export const exercises: Exercise[] = [
  { id: 1, name: 'Barbell Bench Press', bodyPart: 'Грудь', equipment: 'Штанга', target: 'Большая грудная' },
  { id: 2, name: 'Dumbbell Bench Press', bodyPart: 'Грудь', equipment: 'Гантели', target: 'Большая грудная' },
  { id: 3, name: 'Barbell Squat', bodyPart: 'Ноги', equipment: 'Штанга', target: 'Квадрицепс' },
  { id: 4, name: 'Romanian Deadlift', bodyPart: 'Ноги', equipment: 'Штанга', target: 'Бицепс бедра' },
  { id: 5, name: 'Pull Up', bodyPart: 'Спина', equipment: 'Свой вес', target: 'Широчайшая' },
  { id: 6, name: 'Bent Over Row', bodyPart: 'Спина', equipment: 'Штанга', target: 'Широчайшая' },
  { id: 7, name: 'Overhead Press', bodyPart: 'Плечи', equipment: 'Штанга', target: 'Дельтовидная' },
  { id: 8, name: 'Lateral Raise', bodyPart: 'Плечи', equipment: 'Гантели', target: 'Дельтовидная' },
]

export const bodyParts = [...new Set(exercises.map((exercise) => exercise.bodyPart))]
export const equipmentTypes = [...new Set(exercises.map((exercise) => exercise.equipment))]

export const workouts: Workout[] = [
  { id: 1, date: '2026-09-10', title: 'Грудь и плечи', exercises: 4, volume: 8450 },
  { id: 2, date: '2026-09-08', title: 'Ноги', exercises: 3, volume: 12300 },
  { id: 3, date: '2026-09-05', title: 'Спина', exercises: 4, volume: 7800 },
  { id: 4, date: '2026-09-03', title: 'Грудь и плечи', exercises: 4, volume: 8100 },
]

export const workoutSets: WorkoutSet[] = [
  { id: 1, workoutId: 1, exercise: 'Barbell Bench Press', weight: 80, reps: 8 },
  { id: 2, workoutId: 1, exercise: 'Barbell Bench Press', weight: 80, reps: 8 },
  { id: 3, workoutId: 1, exercise: 'Barbell Bench Press', weight: 80, reps: 7 },
  { id: 4, workoutId: 1, exercise: 'Overhead Press', weight: 45, reps: 10 },
  { id: 5, workoutId: 1, exercise: 'Overhead Press', weight: 45, reps: 9 },
  { id: 6, workoutId: 1, exercise: 'Lateral Raise', weight: 12, reps: 15 },
  { id: 7, workoutId: 2, exercise: 'Barbell Squat', weight: 110, reps: 6 },
  { id: 8, workoutId: 2, exercise: 'Barbell Squat', weight: 110, reps: 6 },
  { id: 9, workoutId: 2, exercise: 'Romanian Deadlift', weight: 90, reps: 10 },
  { id: 10, workoutId: 3, exercise: 'Pull Up', weight: 0, reps: 12 },
  { id: 11, workoutId: 3, exercise: 'Bent Over Row', weight: 70, reps: 10 },
  { id: 12, workoutId: 4, exercise: 'Barbell Bench Press', weight: 77.5, reps: 8 },
]

// Демо-прогресс по жиму лёжа. 1RM считается по формуле Эпли: вес × (1 + повторения / 30)
export const exerciseProgress: ProgressPoint[] = [
  { date: '2026-08-04', weight: 70, oneRm: 88 },
  { date: '2026-08-11', weight: 72.5, oneRm: 91 },
  { date: '2026-08-18', weight: 72.5, oneRm: 93 },
  { date: '2026-08-25', weight: 75, oneRm: 95 },
  { date: '2026-09-01', weight: 77.5, oneRm: 97 },
  { date: '2026-09-08', weight: 80, oneRm: 101 },
]

export const measurements: Measurement[] = [
  { id: 1, date: '2026-09-07', weight: 78.4, chest: 102, waist: 84 },
  { id: 2, date: '2026-08-31', weight: 78.9, chest: 101, waist: 85 },
  { id: 3, date: '2026-08-24', weight: 79.3, chest: 101, waist: 86 },
]
