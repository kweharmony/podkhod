import { Search } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { bodyParts, equipmentTypes } from '@/shared/demo/demo'
import { ALL, type Filters } from './filter'

type Props = {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function ExerciseFilters({ filters, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="relative max-w-xs">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск по названию"
          className="pl-9"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[ALL, ...bodyParts].map((part) => (
          <Button
            key={part}
            variant={filters.bodyPart === part ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ ...filters, bodyPart: part })}
          >
            {part}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[ALL, ...equipmentTypes].map((type) => (
          <Button
            key={type}
            variant={filters.equipment === type ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onChange({ ...filters, equipment: type })}
          >
            {type}
          </Button>
        ))}
      </div>
    </div>
  )
}
