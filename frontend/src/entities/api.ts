import { request } from '@/shared/lib/api'
export type Exercise = { id: number; name: string; body_part: string; equipment: string; target: string }
export type Set = { id: number; weight: number; reps: number }
export type Workout = { id: number; date: string; title: string; note: string | null; volume: number;
  exercises: { id: number; exercise: Exercise; sets: Set[]; one_rep_max: number | null }[] }
export type Measurement = { id: number; date: string; weight: number; chest: number | null; waist: number | null }
export const loadExercises = () => request<Exercise[]>('/exercises')
export const loadMeasurements = () => request<Measurement[]>('/measurements')
export async function loadWorkouts() {
  const list = await request<{ id: number }[]>('/workouts')
  return Promise.all(list.map((item) => request<Workout>(`/workouts/${item.id}`)))
}
