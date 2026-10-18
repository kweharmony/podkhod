import { useParams } from 'react-router-dom'
import { Badge } from '@/shared/ui/badge'
import NoData from '@/shared/components/NoData'
import { exercises } from '@/shared/demo/demo'

export default function ExerciseDetail() {
  const { id } = useParams()
  const exercise = exercises.find((item) => item.id === Number(id))

  if (!exercise) {
    return <NoData text="Упражнение не найдено" backTo="/exercises" backLabel="К справочнику" />
  }

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight">{exercise.name}</h1>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{exercise.bodyPart}</Badge>
        <Badge variant="outline">{exercise.equipment}</Badge>
        <Badge variant="outline">{exercise.target}</Badge>
      </div>
    </div>
  )
}
