import { useCallback, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { type Workout, type Set } from '@/entities/api'
import { request } from '@/shared/lib/api'
import { useResource } from '@/shared/lib/useResource'
import ResourceState from '@/shared/components/ResourceState'
import { Button } from '@/shared/ui/button'
import FormField from '@/shared/components/FormField'

function SetForm({ item, save, remove }: { item?: Set; save: (values: {weight:number;reps:number}) => Promise<void>; remove?: () => Promise<void> }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form)
    setBusy(true); setError('')
    try { await save({ weight: Number(values.get('weight')), reps: Number(values.get('reps')) }); if (!item) form.reset() }
    catch (error) { setError((error as Error).message) } finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
    <FormField label="Вес, кг" name="weight" type="number" min={0} max={1000} step="0.1" required defaultValue={item?.weight} className="w-24" />
    <FormField label="Повторы" name="reps" type="number" min={1} max={1000} step={1} required defaultValue={item?.reps} className="w-24" />
    <Button disabled={busy}>{item ? 'Сохранить' : 'Добавить подход'}</Button>
    {remove && <Button type="button" variant="outline" disabled={busy} onClick={async () => { setBusy(true); try { await remove() } catch (error) { setError((error as Error).message) } finally { setBusy(false) } }}>Удалить подход</Button>}
    {error && <p role="alert" className="text-destructive">{error}</p>}
  </form>
}
export default function WorkoutDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const load = useCallback(() => request<Workout>(`/workouts/${id}`), [id])
  const { data, loading, error, reload } = useResource(load)
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  async function change(path: string, method: string, body?: unknown) {
    await request(path, method, body); reload()
  }
  async function edit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const values = new FormData(event.currentTarget)
    setBusy(true); setActionError('')
    try { await change(`/workouts/${id}`, 'PATCH', { title: values.get('title'), date: values.get('date') }) }
    catch (error) { setActionError((error as Error).message) } finally { setBusy(false) }
  }
  return <div className="space-y-6"><ResourceState loading={loading} error={error} />
    {data && <><h1 className="text-3xl font-semibold">{data.title}</h1>
      <form key={data.id} onSubmit={edit} className="flex flex-wrap items-end gap-3">
        <FormField label="Название" name="title" required maxLength={200} defaultValue={data.title} />
        <FormField label="Дата" name="date" type="date" required defaultValue={data.date} />
        <Button disabled={busy}>Сохранить тренировку</Button>
      </form>
      <p>Объём: {data.volume} кг</p>
      <Button asChild variant="outline"><Link to={`/exercises?workout=${id}`}>Добавить упражнение</Link></Button>
      {data.exercises.length === 0 && <p>Добавьте первое упражнение</p>}
      {data.exercises.map((item) => <section key={item.id} className="space-y-4 rounded-xl border p-4">
        <h2 className="font-semibold">{item.exercise.name}</h2>
        {item.sets.map((set) => <SetForm key={set.id} item={set}
          save={(values) => change(`/workouts/sets/${set.id}`, 'PATCH', values)}
          remove={() => change(`/workouts/sets/${set.id}`, 'DELETE')} />)}
        <SetForm save={(values) => change(`/workouts/exercises/${item.id}/sets`, 'POST', values)} />
        <Button variant="outline" onClick={async () => { try { await change(`/workouts/exercises/${item.id}`, 'DELETE') } catch (error) { setActionError((error as Error).message) } }}>Убрать упражнение</Button>
      </section>)}
      <Button variant="outline" disabled={busy} onClick={async () => {
        if (!window.confirm('Удалить тренировку и подходы?')) return
        setBusy(true)
        try { await request(`/workouts/${id}`, 'DELETE'); navigate('/workouts') }
        catch (error) { setActionError((error as Error).message) } finally { setBusy(false) }
      }}>Удалить тренировку</Button>
      <Button asChild><Link to="/workouts">Готово</Link></Button>
    </>}
    {actionError && <p role="alert" className="text-destructive">{actionError}</p>}
  </div>
}
