import { useState, type FormEvent } from 'react'
import { loadMeasurements, type Measurement } from '@/entities/api'
import { useAuth } from '@/features/auth/context'
import { request } from '@/shared/lib/api'
import { useResource } from '@/shared/lib/useResource'
import ResourceState from '@/shared/components/ResourceState'
import FormField from '@/shared/components/FormField'
import { Button } from '@/shared/ui/button'
export default function Measurements() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useResource(loadMeasurements)
  const [editing, setEditing] = useState<Measurement | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const body = {
      user_id: user!.id,
      date: values.get('date'),
      weight: Number(values.get('weight')),
      chest: values.get('chest') ? Number(values.get('chest')) : null,
      waist: values.get('waist') ? Number(values.get('waist')) : null,
    }
    setBusy(true)
    setMessage('')
    try {
      await request(
        editing ? `/measurements/${editing.id}` : '/measurements',
        editing ? 'PATCH' : 'POST',
        body,
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
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Замеры тела</h1>
      <form
        key={editing?.id ?? 'new'}
        onSubmit={submit}
        className="flex flex-wrap items-end gap-3"
      >
        <FormField
          label="Дата"
          name="date"
          type="date"
          required
          defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)}
        />
        <FormField
          label="Вес, кг"
          name="weight"
          type="number"
          step="0.1"
          min="0.1"
          max="499"
          required
          defaultValue={editing?.weight}
        />
        <FormField
          label="Грудь, см"
          name="chest"
          type="number"
          step="0.1"
          min="0.1"
          max="299"
          defaultValue={editing?.chest ?? ''}
        />
        <FormField
          label="Талия, см"
          name="waist"
          type="number"
          step="0.1"
          min="0.1"
          max="299"
          defaultValue={editing?.waist ?? ''}
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
      <ResourceState loading={loading} error={error} />
      {message && (
        <p role="alert" className="text-destructive">
          {message}
        </p>
      )}
      {data?.length === 0 && <p>Замеров пока нет</p>}
      {data?.map((item) => (
        <div key={item.id} className="flex flex-wrap gap-4 rounded border p-4">
          <span>
            {item.date} · {item.weight} кг · грудь {item.chest ?? '—'} · талия{' '}
            {item.waist ?? '—'}
          </span>
          <Button variant="outline" onClick={() => setEditing(item)}>
            Изменить
          </Button>
          <Button
            disabled={busy}
            variant="outline"
            onClick={async () => {
              if (!window.confirm('Удалить замер?')) return
              setBusy(true)
              try {
                await request(`/measurements/${item.id}`, 'DELETE')
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
        </div>
      ))}
    </div>
  )
}
