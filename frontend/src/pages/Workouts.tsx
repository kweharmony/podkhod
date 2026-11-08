import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { loadWorkouts } from '@/entities/api'
import { useResource } from '@/shared/lib/useResource'
import ResourceState from '@/shared/components/ResourceState'
import { Button } from '@/shared/ui/button'
export default function Workouts() {
  const { data, loading, error } = useResource(loadWorkouts)
  return <div className="space-y-6"><h1 className="text-3xl font-semibold">Тренировки</h1>
    <Button asChild><Link to="/workouts/new">Новая тренировка</Link></Button>
    <ResourceState loading={loading} error={error} />
    {data?.length === 0 && <p>Тренировок пока нет</p>}
    {data?.map((item) => <motion.div key={item.id} initial={{opacity:0}} animate={{opacity:1}} className="rounded-xl border p-4">
      <Link to={`/workouts/${item.id}`}>{item.title} · {item.date} · {item.volume} кг</Link>
    </motion.div>)}
  </div>
}
