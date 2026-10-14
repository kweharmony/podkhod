export type Exercise = {
  id: number
  name: string
  bodyPart: string
  equipment: string
  target: string
}

export type Workout = {
  id: number
  date: string
  title: string
  exercises: number
  volume: number
}

export type WorkoutSet = {
  id: number
  workoutId: number
  exercise: string
  weight: number
  reps: number
}

export type Measurement = {
  id: number
  date: string
  weight: number
  chest: number
  waist: number
}

export type ProgressPoint = {
  date: string
  weight: number
  oneRm: number
}
