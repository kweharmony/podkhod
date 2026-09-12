import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { bodyParts, equipmentTypes, exercises } from '@/data/demo'

const ALL = 'Все'

export default function Exercises() {
  const [bodyPart, setBodyPart] = useState(ALL)
  const [equipment, setEquipment] = useState(ALL)
  const [query, setQuery] = useState('')

  const visible = exercises.filter(
    (exercise) =>
      (bodyPart === ALL || exercise.bodyPart === bodyPart) &&
      (equipment === ALL || exercise.equipment === equipment) &&
      exercise.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Упражнения</h1>

      <div className="space-y-3">
        <div className="relative max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию"
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[ALL, ...bodyParts].map((part) => (
            <Button
              key={part}
              variant={bodyPart === part ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBodyPart(part)}
            >
              {part}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {[ALL, ...equipmentTypes].map((type) => (
            <Button
              key={type}
              variant={equipment === type ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setEquipment(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Ничего не найдено. Попробуйте изменить фильтры.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((exercise) => (
            <Link key={exercise.id} to={`/exercises/${exercise.id}`}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{exercise.bodyPart}</Badge>
                  <Badge variant="outline">{exercise.equipment}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
