import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Похоже, это не email'),
  password: z.string().min(6, 'Пароль не короче 6 символов'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Имя не короче 2 символов'),
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
