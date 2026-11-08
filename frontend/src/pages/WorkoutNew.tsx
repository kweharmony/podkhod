import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context'
import { request } from '@/shared/lib/api'
import { Button } from '@/shared/ui/button'
import FormField from '@/shared/components/FormField'
export default function WorkoutNew() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setBusy(true)
    setError('')
    try {
      const workout = await request<{ id: number }>('/workouts', 'POST', {
        user_id: user!.id,
        title: values.get('title'),
        date: values.get('date'),
      })
      navigate(`/workouts/${workout.id}`, { replace: true })
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <form onSubmit={submit} className="max-w-lg space-y-4">
      <h1 className="text-3xl font-semibold">Новая тренировка</h1>
      <FormField
        id="title"
        name="title"
        label="Название"
        required
        maxLength={200}
      />
      <FormField
        id="date"
        name="date"
        label="Дата"
        type="date"
        required
        defaultValue={new Date().toISOString().slice(0, 10)}
      />
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <Button disabled={busy}>Создать</Button>
    </form>
  )
}
