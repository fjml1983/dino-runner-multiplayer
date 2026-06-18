import { describe, it, expect } from 'vitest'
import { getCurrentWeekId, getWeekStart, getWeekEnd } from '../utils/week.js'

describe('ISO week utilities', () => {
  it('getCurrentWeekId returns format YYYY-WNN', () => {
    const weekId = getCurrentWeekId()
    expect(weekId).toMatch(/^\d{4}-W\d{2}$/)
  })

  it('getWeekStart returns Monday of the given week', () => {
    const weekId = '2026-W25'
    const start = getWeekStart(weekId)
    expect(start.getDay()).toBe(1)
  })

  it('getWeekEnd returns Sunday of the given week', () => {
    const weekId = '2026-W25'
    const end = getWeekEnd(weekId)
    expect(end.getDay()).toBe(0)
  })

  it('getWeekStart and getWeekEnd span 7 days', () => {
    const weekId = '2026-W25'
    const start = getWeekStart(weekId)
    const end = getWeekEnd(weekId)
    const diff = end.getTime() - start.getTime()
    expect(diff).toBe(6 * 24 * 60 * 60 * 1000)
  })
})
