import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import FormField from '@/shared/components/FormField'
import man from '@/assets/man.png'
import woman from '@/assets/woman.png'
import { registerSchema, type RegisterValues } from './schemas'

type Gender = 'male' | 'female'

const genders: { value: Gender; label: string; image: string }[] = [
  { value: 'male', label: 'Мужской', image: man },
  { value: 'female', label: 'Женский', image: woman },
]

export default function RegisterForm() {
  const navigate = useNavigate()
  const [gender, setGender] = useState<Gender>('male')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  // Регистрация появится в ЛР №4, пока проверяем форму и переходим на дашборд.
  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600))
    navigate('/dashboard')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        id="name"
        label="Имя"
        placeholder="Иван"
        error={errors.name?.message}
        {...register('name')}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormField
        id="password"
        label="Пароль"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="grid gap-2">
        <Label>Пол</Label>
        <div className="grid grid-cols-2 gap-3">
          {genders.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setGender(item.value)}
              className={`rounded-xl border p-3 transition-colors ${
                gender === item.value
                  ? 'border-foreground'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <img src={item.image} alt={item.label} className="mx-auto h-24 object-contain" />
              <span className="mt-2 block text-sm">{item.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Нужен для анатомических схем мышц и расчёта расхода калорий.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Создаём аккаунт...' : 'Создать аккаунт'}
      </Button>
    </form>
  )
}
