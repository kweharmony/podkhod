import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProgressChart from '@/components/ProgressChart'
import VolumeChart from '@/components/VolumeChart'
import { exerciseProgress, workouts } from '@/data/demo'
import hero from '@/assets/hero.png'

const steps = [
  {
    number: '01',
    title: 'Записываете подход',
    text: 'Упражнение, вес, повторения. Три касания между подходами, без блокнота и заметок в телефоне.',
  },
  {
    number: '02',
    title: 'Повторяете тренировку',
    text: 'Прошлый комплекс копируется целиком, а рядом с каждым упражнением видно, сколько вы подняли в прошлый раз.',
  },
  {
    number: '03',
    title: 'Видите прогресс',
    text: 'Объём тренировки и расчётный максимум по каждому упражнению. Не ощущения, а цифры.',
  },
]

export default function Home() {
  return (
    <div>
      <section className="grid items-center gap-12 py-16 md:grid-cols-2">
        <img src={hero} alt="Подход" className="mx-auto w-full max-w-md" />

        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Каждый подход имеет значение
          </h1>
          <p className="text-lg text-muted-foreground">
            Сила растёт не за одну тренировку, а за сотню подходов, которые вы не пропустили.
            Podkhod помнит каждый из них и показывает, как далеко вы ушли от себя прежнего.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register">
                Начать вести дневник
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/exercises">Посмотреть упражнения</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Как это работает</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="space-y-3">
              <p className="text-5xl font-semibold tracking-tight text-muted-foreground/40">{step.number}</p>
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Прогресс видно сразу</h2>
        <p className="mt-2 text-muted-foreground">
          Так выглядит дневник через полтора месяца регулярных тренировок.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Жим лёжа: рабочий вес и расчётный максимум</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart data={exerciseProgress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Объём тренировок</CardTitle>
            </CardHeader>
            <CardContent>
              <VolumeChart workouts={workouts} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Начните с первого подхода</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Регистрация занимает минуту, а справочник из 1324 упражнений доступен сразу.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/register">
            Создать аккаунт
            <ArrowRight />
          </Link>
        </Button>
      </section>
    </div>
  )
}
