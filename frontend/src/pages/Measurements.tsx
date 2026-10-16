import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import MeasurementTable from '@/entities/measurement/MeasurementTable'
import MeasurementForm from '@/features/measurement-form/MeasurementForm'
import type { MeasurementValues } from '@/features/measurement-form/schema'
import { measurements as demoMeasurements } from '@/shared/demo/demo'
import type { Measurement } from '@/entities/types'

export default function Measurements() {
  const [measurements, setMeasurements] = useState<Measurement[]>(demoMeasurements)

  function addMeasurement(values: MeasurementValues) {
    const measurement: Measurement = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      ...values,
    }
    setMeasurements([measurement, ...measurements])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Замеры тела</h1>

      <Card>
        <CardHeader>
          <CardTitle>Новый замер</CardTitle>
        </CardHeader>
        <CardContent>
          <MeasurementForm onAdd={addMeasurement} />
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
