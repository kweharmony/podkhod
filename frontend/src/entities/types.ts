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

export type ProgressPoint = {
  date: string
  weight: number
  oneRm: number
}
