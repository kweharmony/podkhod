import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import FormField from '@/shared/components/FormField'
import { measurementSchema, type MeasurementValues } from './schema'

type Props = {
  onAdd: (values: MeasurementValues) => void
}

export default function MeasurementForm({ onAdd }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MeasurementValues>({ resolver: zodResolver(measurementSchema) })

  function onSubmit(values: MeasurementValues) {
    onAdd(values)
    reset()
  }

  return (
    <form className="flex flex-wrap items-start gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        id="weight"
        label="Вес, кг"
        type="number"
        step="0.1"
        className="w-32"
        placeholder="78.4"
        error={errors.weight?.message}
        {...register('weight', { valueAsNumber: true })}
      />
      <FormField
        id="chest"
        label="Грудь, см"
        type="number"
        className="w-32"
        placeholder="102"
        error={errors.chest?.message}
        {...register('chest', { valueAsNumber: true })}
      />
      <FormField
        id="waist"
        label="Талия, см"
        type="number"
        className="w-32"
        placeholder="84"
        error={errors.waist?.message}
        {...register('waist', { valueAsNumber: true })}
      />
      <Button type="submit" className="mt-8">
        <Plus />
        Сохранить
      </Button>
    </form>
  )
}
