import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import WorkoutCard from '@/entities/workout/WorkoutCard'
import { workouts } from '@/shared/demo/demo'

export default function Workouts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Тренировки</h1>
        <Button asChild>
          <Link to="/workouts/new">
            <Plus />
            Новая тренировка
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  )
}
