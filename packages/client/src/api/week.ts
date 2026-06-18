export function getCurrentWeekId(): string {
  const now = new Date()
  const temp = new Date(now.getTime())
  temp.setUTCHours(0, 0, 0, 0)
  temp.setUTCDate(temp.getUTCDate() + 3 - ((temp.getUTCDay() + 6) % 7))
  const week = Math.ceil(
    ((temp.getTime() - new Date(temp.getUTCFullYear(), 0, 4).getTime()) / 86400000 + 1) / 7
  )
  return `${temp.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function getPreviousWeekId(weekId: string): string {
  const [yearStr, weekStr] = weekId.split('-W')
  let year = Number(yearStr)
  let week = Number(weekStr) - 1
  if (week < 1) {
    const prevYear = year - 1
    const dec31 = new Date(prevYear, 11, 31)
    const temp = new Date(dec31.getTime())
    temp.setUTCDate(temp.getUTCDate() + 3 - ((temp.getUTCDay() + 6) % 7))
    week = Math.ceil(
      ((temp.getTime() - new Date(temp.getUTCFullYear(), 0, 4).getTime()) / 86400000 + 1) / 7
    )
    year = prevYear
  }
  return `${year}-W${String(week).padStart(2, '0')}`
}
