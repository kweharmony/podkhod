import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import man from '@/assets/man.png'
import woman from '@/assets/woman.png'

type Gender = 'male' | 'female'

const genders: { value: Gender; label: string; image: string }[] = [
  { value: 'male', label: 'Мужской', image: man },
  { value: 'female', label: 'Женский', image: woman },
]

export default function Register() {
  const [gender, setGender] = useState<Gender>('male')

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" placeholder="Иван" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" />
          </div>

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

          <Button className="w-full">Создать аккаунт</Button>
          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-foreground underline">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
