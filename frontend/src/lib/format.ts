export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}

export function formatDayMonth(iso: string) {
  const [, month, day] = iso.split('-')
  return `${day}.${month}`
}
