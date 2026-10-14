import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { formatDate } from '@/shared/lib/format'
import type { Measurement } from '@/entities/types'

type Props = {
  measurements: Measurement[]
}

export default function MeasurementTable({ measurements }: Props) {
  return (
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
  )
}
