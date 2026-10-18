import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import FormField from '@/shared/components/FormField'
import { registerSchema, type RegisterValues } from './schemas'

export default function RegisterForm() {
  const navigate = useNavigate()
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Создаём аккаунт...' : 'Создать аккаунт'}
      </Button>
    </form>
  )
}
