import { describe, it, expect } from 'vitest'

function pickPowerUpType(): 'shield' | 'slowmo' {
  return Math.random() < 0.7 ? 'shield' : 'slowmo'
}

describe('power-up spawn probabilities', () => {
  it('picks shield approximately 70% of the time', () => {
    const counts = { shield: 0, slowmo: 0 }
    const iterations = 10000
    for (let i = 0; i < iterations; i++) {
      const type = pickPowerUpType()
      counts[type]++
    }
    const shieldRatio = counts.shield / iterations
    expect(shieldRatio).toBeGreaterThan(0.65)
    expect(shieldRatio).toBeLessThan(0.75)
  })

  it('picks slowmo approximately 30% of the time', () => {
    const counts = { shield: 0, slowmo: 0 }
    const iterations = 10000
    for (let i = 0; i < iterations; i++) {
      const type = pickPowerUpType()
      counts[type]++
    }
    const slowmoRatio = counts.slowmo / iterations
    expect(slowmoRatio).toBeGreaterThan(0.25)
    expect(slowmoRatio).toBeLessThan(0.35)
  })
})
