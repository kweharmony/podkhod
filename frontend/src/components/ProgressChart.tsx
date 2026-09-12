import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartAxisProps, chartTooltipStyle } from '@/lib/chart'
import { formatDayMonth } from '@/lib/format'
import type { ProgressPoint } from '@/types'

type Props = {
  data: ProgressPoint[]
}

export default function ProgressChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" tickFormatter={formatDayMonth} {...chartAxisProps} />
        <YAxis domain={['dataMin - 5', 'dataMax + 5']} {...chartAxisProps} />
        <Tooltip
          contentStyle={chartTooltipStyle}
          labelFormatter={(label) => formatDayMonth(String(label))}
        />
        <Legend wrapperStyle={{ fontSize: 13 }} />
        <Line
          type="monotone"
          dataKey="weight"
          name="Рабочий вес, кг"
          stroke="var(--foreground)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="oneRm"
          name="Расчётный 1RM, кг"
          stroke="var(--muted-foreground)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
