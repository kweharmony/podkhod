import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loadWorkouts, loadMeasurements } from '@/entities/api'
import { request } from '@/shared/lib/api'
import { useAuth } from '@/features/auth/context'
import { useResource } from '@/shared/lib/useResource'
import ResourceState from '@/shared/components/ResourceState'
import VolumeChart from '@/entities/progress/VolumeChart'
import { Button } from '@/shared/ui/button'
type Advice = { text: string; source: string; created_at: string }
async function loadDashboard() {
  return {
    workouts: await loadWorkouts(),
    measurements: await loadMeasurements(),
  }
}
export default function Dashboard() {
  const { user } = useAuth()
  const { data, loading, error } = useResource(loadDashboard)
  const loadAdvice = async () => {
    try {
      return await request<Advice>(`/users/${user!.id}/advice`)
    } catch (error) {
      if ((error as Error).message === 'Советов пока нет') return null
      throw error
    }
  }
  const [advice, setAdvice] = useState<Advice | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [today] = useState(() => Date.now())
  const week = (data?.workouts ?? []).filter((w) => {
    const days = (today - new Date(w.date).getTime()) / 86400000
    return days >= 0 && days < 7
  })
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{user?.name}, ваш дневник</h1>
      <Button asChild>
        <Link to="/workouts/new">Начать тренировку</Link>
      </Button>
      <ResourceState loading={loading} error={error} />
      {data && (
        <>
          <p>
            За 7 дней: {week.length} тренировок ·{' '}
            {week.reduce((sum, w) => sum + w.volume, 0)} кг
          </p>
          <p>Последний вес: {data.measurements[0]?.weight ?? 'нет замеров'}</p>
          {data.workouts.length ? (
            <VolumeChart
              workouts={data.workouts.map((w) => ({
                ...w,
                exercises: w.exercises.length,
              }))}
            />
          ) : (
            <p>Начните первую тренировку</p>
          )}
          {data.workouts[0] && (
            <Link to={`/workouts/${data.workouts[0].id}`}>
              Последняя тренировка: {data.workouts[0].title}
            </Link>
          )}
        </>
      )}
      <section className="space-y-3 rounded-xl border p-4">
        <h2>Помощник</h2>
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            setMessage('')
            try {
              setAdvice(await loadAdvice())
            } catch (error) {
              setMessage((error as Error).message)
            } finally {
              setBusy(false)
            }
          }}
        >
          Последний совет
        </Button>
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            setMessage('')
            try {
              setAdvice(
                await request<Advice>(`/users/${user!.id}/advice`, 'POST'),
              )
            } catch (error) {
              setMessage((error as Error).message)
            } finally {
              setBusy(false)
            }
          }}
        >
          {busy ? 'Подождите...' : 'Получить новый совет'}
        </Button>
        {advice ? (
          <>
            <p>{advice.text}</p>
            <p className="text-sm text-muted-foreground">
              {advice.created_at} · {advice.source === 'ai' ? 'ИИ' : 'Правила'}
            </p>
          </>
        ) : (
          <p>Совет ещё не загружен</p>
        )}
        {message && (
          <p role="alert" className="text-destructive">
            {message}
          </p>
        )}
      </section>
    </div>
  )
}
