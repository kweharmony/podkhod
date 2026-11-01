import { useState } from 'react'
import { authenticate } from './api'
import { useAuth } from './context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import FormField from '@/shared/components/FormField'
import { registerSchema, type RegisterValues } from './schemas'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values: RegisterValues) {
    setError('')
    try {
      const user = await authenticate('register', values)
      setUser(user)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Сервер недоступен')
    }
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

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Создаём аккаунт...' : 'Создать аккаунт'}
      </Button>
    </form>
  )
}
