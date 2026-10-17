import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import WorkoutCard from '@/entities/workout/WorkoutCard'
import ErrorState from '@/shared/components/ErrorState'
import Loading from '@/shared/components/Loading'
import NoData from '@/shared/components/NoData'
import { useDemoData } from '@/shared/lib/useDemoData'
import { workouts } from '@/shared/demo/demo'

export default function Workouts() {
  const { data, loading, error } = useDemoData(workouts)

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

      {loading && <Loading />}
      {error && <ErrorState />}
      {!loading && !error && data.length === 0 && (
        <NoData text="Тренировок пока нет. Начните первую." />
      )}

      <div className="space-y-3">
        {!loading &&
          !error &&
          data.map((workout, index) => (
            // Карточки появляются по очереди, чтобы список не возникал рывком
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
            >
              <WorkoutCard workout={workout} />
            </motion.div>
          ))}
      </div>
    </div>
  )
}
