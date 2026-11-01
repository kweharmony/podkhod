import { useState } from 'react'
import { authenticate } from './api'
import { useAuth } from './context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import FormField from '@/shared/components/FormField'
import { loginSchema, type LoginValues } from './schemas'

export default function LoginForm() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginValues) {
    setError('')
    try {
      const user = await authenticate('login', values)
      setUser(user)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Сервер недоступен')
    }
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
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Входим...' : 'Войти'}
      </Button>
    </form>
  )
}
