import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import MeasurementTable from '@/entities/measurement/MeasurementTable'
import MeasurementForm from '@/features/measurement-form/MeasurementForm'
import type { MeasurementValues } from '@/features/measurement-form/schema'
import ErrorState from '@/shared/components/ErrorState'
import Loading from '@/shared/components/Loading'
import NoData from '@/shared/components/NoData'
import { useDemoData } from '@/shared/lib/useDemoData'
import { measurements as demoMeasurements } from '@/shared/demo/demo'
import type { Measurement } from '@/entities/types'

export default function Measurements() {
  const [formOpen, setFormOpen] = useState(false)
  const { data, loading, error } = useDemoData(demoMeasurements)
  // Добавленные замеры храним отдельно и показываем перед загруженными
  const [added, setAdded] = useState<Measurement[]>([])
  const measurements = [...added, ...data]

  function addMeasurement(values: MeasurementValues) {
    const measurement: Measurement = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      ...values,
    }
    setAdded([measurement, ...added])
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Замеры тела</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Новый замер</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setFormOpen(!formOpen)}>
            {formOpen ? <X /> : <Plus />}
            {formOpen ? 'Отмена' : 'Добавить'}
          </Button>
        </CardHeader>

        {/* Форма раскрывается плавно, чтобы таблица не прыгала под ней */}
        <AnimatePresence initial={false}>
          {formOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent>
                <MeasurementForm onAdd={addMeasurement} />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <Loading />}
          {error && <ErrorState text="Не удалось загрузить замеры" />}
          {!loading && !error && measurements.length === 0 && (
            <NoData text="Замеров пока нет. Добавьте первый." />
          )}
          {!loading && !error && measurements.length > 0 && (
            <MeasurementTable measurements={measurements} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
