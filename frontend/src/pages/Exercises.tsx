import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { loadExercises, type Exercise } from '@/entities/api'
import { request } from '@/shared/lib/api'
import { useResource } from '@/shared/lib/useResource'
import ResourceState from '@/shared/components/ResourceState'
import FormField from '@/shared/components/FormField'
import { Button } from '@/shared/ui/button'
export default function Exercises() {
  const { data, loading, error, reload } = useResource(loadExercises)
  const [params] = useSearchParams()
  const workout = params.get('workout')
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [part, setPart] = useState('')
  const [equipment, setEquipment] = useState('')
  const [editing, setEditing] = useState<Exercise | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setBusy(true)
    setMessage('')
    try {
      await request(
        editing ? `/exercises/${editing.id}` : '/exercises',
        editing ? 'PATCH' : 'POST',
        values,
      )
      setEditing(null)
      form.reset()
      reload()
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy(false)
    }
  }
  const visible = data?.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) &&
      (!part || e.body_part === part) &&
      (!equipment || e.equipment === equipment),
  )
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Упражнения</h1>
      {workout && (
        <Link to={`/workouts/${workout}`}>Вернуться к тренировке</Link>
      )}
      <div className="flex flex-wrap gap-3">
        <FormField
          label="Поиск"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label>
          Мышцы{' '}
          <select
            className="rounded border p-2"
            value={part}
            onChange={(e) => setPart(e.target.value)}
          >
            <option value="">Все</option>
            {[...new Set(data?.map((e) => e.body_part))].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Оборудование{' '}
          <select
            className="rounded border p-2"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            <option value="">Все</option>
            {[...new Set(data?.map((e) => e.equipment))].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      <ResourceState loading={loading} error={error} />
      {visible?.length === 0 && (
        <p>Упражнений не найдено. Добавьте упражнение ниже.</p>
      )}
      <div className="grid gap-3 md:grid-cols-3">
        {visible?.map((e) => (
          <section key={e.id} className="space-y-3 rounded-xl border p-4">
            <h2>{e.name}</h2>
            <p>
              {e.body_part} · {e.equipment} · {e.target}
            </p>
            {workout && (
              <Button
                disabled={busy}
                onClick={async () => {
                  setBusy(true)
                  try {
                    await request(`/workouts/${workout}/exercises`, 'POST', {
                      exercise_id: e.id,
                    })
                    navigate(`/workouts/${workout}`)
                  } catch (error) {
                    setMessage((error as Error).message)
                  } finally {
                    setBusy(false)
                  }
                }}
              >
                В тренировку
              </Button>
            )}
            <Button variant="outline" onClick={() => setEditing(e)}>
              Изменить
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                if (!window.confirm('Удалить упражнение?')) return
                setBusy(true)
                try {
                  await request(`/exercises/${e.id}`, 'DELETE')
                  reload()
                } catch (error) {
                  setMessage((error as Error).message)
                } finally {
                  setBusy(false)
                }
              }}
            >
              Удалить
            </Button>
          </section>
        ))}
      </div>
      <form
        key={editing?.id ?? 'new'}
        onSubmit={submit}
        className="max-w-lg space-y-3"
      >
        <h2>{editing ? 'Изменить упражнение' : 'Добавить упражнение'}</h2>
        <FormField
          label="Название"
          name="name"
          required
          maxLength={200}
          defaultValue={editing?.name}
        />
        <FormField
          label="Группа мышц"
          name="body_part"
          required
          maxLength={50}
          defaultValue={editing?.body_part}
        />
        <FormField
          label="Оборудование"
          name="equipment"
          required
          maxLength={50}
          defaultValue={editing?.equipment}
        />
        <FormField
          label="Целевая мышца"
          name="target"
          required
          maxLength={100}
          defaultValue={editing?.target}
        />
        <Button disabled={busy}>Сохранить</Button>
        {editing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditing(null)}
          >
            Отмена
          </Button>
        )}
      </form>
      {message && (
        <p role="alert" className="text-destructive">
          {message}
        </p>
      )}
    </div>
  )
}
