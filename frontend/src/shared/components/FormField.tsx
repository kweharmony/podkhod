import { useId, type ComponentProps } from 'react'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

type Props = ComponentProps<'input'> & {
  label: string
  error?: string
}

// Поле формы: подпись, поле ввода и текст ошибки под ним.
// Один компонент на все формы, чтобы ошибки выглядели одинаково.
export default function FormField({ label, error, id, ...props }: Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input id={fieldId} aria-invalid={Boolean(error)} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
