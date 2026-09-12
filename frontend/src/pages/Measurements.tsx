import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/format'
import { measurements } from '@/data/demo'

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Вес, кг</TableHead>
                <TableHead>Грудь, см</TableHead>
                <TableHead>Талия, см</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.weight}</TableCell>
                  <TableCell>{item.chest}</TableCell>
                  <TableCell>{item.waist}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
