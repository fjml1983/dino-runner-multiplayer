export function getCurrentWeekId(): string {
  const now = new Date()
  return getWeekId(now)
}

export function getWeekId(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week = Math.ceil(
    ((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000 + 1) / 7
  )
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export function getWeekStart(weekId: string): Date {
  const [yearStr, weekStr] = weekId.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)
  const jan4 = new Date(year, 0, 4)
  const jan4Day = (jan4.getDay() + 6) % 7
  const jan4WeekStart = new Date(jan4)
  jan4WeekStart.setDate(jan4.getDate() - jan4Day)
  const result = new Date(jan4WeekStart)
  result.setDate(result.getDate() + (week - 1) * 7)
  return result
}

export function getWeekEnd(weekId: string): Date {
  const start = getWeekStart(weekId)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return end
}
