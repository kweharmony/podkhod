import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { chartAxisProps, chartTooltipStyle } from '@/shared/lib/chart'
import { formatDayMonth } from '@/shared/lib/format'
import type { Workout } from '@/entities/types'

type Props = {
  workouts: Workout[]
}

export default function VolumeChart({ workouts }: Props) {
  const data = [...workouts].reverse()

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDayMonth} {...chartAxisProps} />
        <Tooltip
          cursor={{ fill: 'var(--muted)' }}
          contentStyle={chartTooltipStyle}
          labelFormatter={(label) => formatDayMonth(String(label))}
        />
        <Bar dataKey="volume" name="Объём, кг" fill="var(--foreground)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
