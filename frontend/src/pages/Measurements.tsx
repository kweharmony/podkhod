import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import MeasurementTable from '@/entities/measurement/MeasurementTable'
import { measurements } from '@/shared/demo/demo'

export default function Measurements() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Замеры тела</h1>

      <Card>
        <CardHeader>
          <CardTitle>Новый замер</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="grid gap-2">
            <Label htmlFor="weight">Вес, кг</Label>
            <Input id="weight" type="number" className="w-32" placeholder="78.4" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="chest">Грудь, см</Label>
            <Input id="chest" type="number" className="w-32" placeholder="102" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="waist">Талия, см</Label>
            <Input id="waist" type="number" className="w-32" placeholder="84" />
          </div>
          <Button>
            <Plus />
            Сохранить
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История</CardTitle>
        </CardHeader>
        <CardContent>
          <MeasurementTable measurements={measurements} />
        </CardContent>
      </Card>
    </div>
  )
}
