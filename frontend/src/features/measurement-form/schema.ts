import { z } from 'zod'

// Поля приходят как числа: в register стоит valueAsNumber, пустое поле даёт NaN
const number = z.number({ error: 'Введите число' })

export const measurementSchema = z.object({
  weight: number.min(30, 'Вес от 30 до 300 кг').max(300, 'Вес от 30 до 300 кг'),
  chest: number.min(50, 'Обхват от 50 до 200 см').max(200, 'Обхват от 50 до 200 см'),
  waist: number.min(40, 'Обхват от 40 до 200 см').max(200, 'Обхват от 40 до 200 см'),
})

export type MeasurementValues = z.infer<typeof measurementSchema>
