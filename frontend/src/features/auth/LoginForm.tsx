import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import FormField from '@/shared/components/FormField'
import { loginSchema, type LoginValues } from './schemas'

export default function LoginForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  // Входа пока нет, он будет в ЛР №4. Проверяем только форму и переходим на дашборд.
  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600))
    navigate('/dashboard')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
        {isSubmitting ? 'Входим...' : 'Войти'}
      </Button>
    </form>
  )
}
