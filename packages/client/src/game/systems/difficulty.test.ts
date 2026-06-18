import { describe, it, expect } from 'vitest'
import { getDifficulty, getCurrentSpeed } from './difficulty'

describe('getDifficulty', () => {
  it('returns Calm for score 0-49', () => {
    expect(getDifficulty(0).name).toBe('Calm')
    expect(getDifficulty(25).name).toBe('Calm')
    expect(getDifficulty(49).name).toBe('Calm')
  })

  it('returns Rhythm for score 50-199', () => {
    expect(getDifficulty(50).name).toBe('Rhythm')
    expect(getDifficulty(100).name).toBe('Rhythm')
    expect(getDifficulty(199).name).toBe('Rhythm')
  })

  it('returns Complexity for score 200-499', () => {
    expect(getDifficulty(200).name).toBe('Complexity')
    expect(getDifficulty(350).name).toBe('Complexity')
    expect(getDifficulty(499).name).toBe('Complexity')
  })

  it('returns Chaos for score 500+', () => {
    expect(getDifficulty(500).name).toBe('Chaos')
    expect(getDifficulty(1000).name).toBe('Chaos')
  })

  it('returns Calm for negative score', () => {
    expect(getDifficulty(-1).name).toBe('Calm')
  })
})

describe('getCurrentSpeed', () => {
  it('starts at 400 speed for score 0', () => {
    expect(getCurrentSpeed(0)).toBeGreaterThanOrEqual(400)
  })

  it('increases with score', () => {
    const speedLow = getCurrentSpeed(0)
    const speedHigh = getCurrentSpeed(100)
    expect(speedHigh).toBeGreaterThanOrEqual(speedLow)
  })

  it('does not exceed MAX_SPEED (1200)', () => {
    const speed = getCurrentSpeed(10000)
    expect(speed).toBeLessThanOrEqual(1200)
  })
})
