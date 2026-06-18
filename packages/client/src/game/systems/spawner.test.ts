import { describe, it, expect } from 'vitest'
import { getPatternsForPhase, pickPattern } from './spawner'
import type { PhaseConfig } from './difficulty'

function makePhase(name: string): PhaseConfig {
  return {
    name,
    minScore: 0,
    maxScore: 100,
    speedRange: [400, 500],
    spawnInterval: [1, 2],
    allowPterodactyl: name === 'Chaos' || name === 'Complexity',
  }
}

describe('getPatternsForPhase', () => {
  it('returns only cactus patterns for Calm', () => {
    const patterns = getPatternsForPhase(makePhase('Calm'))
    expect(patterns.length).toBeGreaterThan(0)
    patterns.forEach((p) => expect(p.type).not.toBe('pterodactyl'))
  })

  it('includes pterodactyl for Complexity', () => {
    const patterns = getPatternsForPhase(makePhase('Complexity'))
    expect(patterns.some((p) => p.type === 'pterodactyl')).toBe(true)
  })

  it('includes pterodactyl for Chaos', () => {
    const patterns = getPatternsForPhase(makePhase('Chaos'))
    expect(patterns.some((p) => p.type === 'pterodactyl')).toBe(true)
  })

  it('returns patterns for Calm', () => {
    const patterns = getPatternsForPhase(makePhase('Calm'))
    expect(patterns.length).toBeGreaterThan(0)
  })

  it('returns patterns for Rhythm', () => {
    const patterns = getPatternsForPhase(makePhase('Rhythm'))
    expect(patterns.length).toBeGreaterThan(0)
  })
})

describe('pickPattern', () => {
  it('returns a valid pattern', () => {
    const pattern = pickPattern(makePhase('Calm'))
    expect(['cactus', 'cactus-group', 'pterodactyl']).toContain(pattern.type)
    expect(pattern.count).toBeGreaterThan(0)
  })

  it('returns a pattern for each phase', () => {
    const phases = ['Calm', 'Rhythm', 'Complexity', 'Chaos']
    phases.forEach((name) => {
      const pattern = pickPattern(makePhase(name))
      expect(['cactus', 'cactus-group', 'pterodactyl']).toContain(pattern.type)
    })
  })
})
