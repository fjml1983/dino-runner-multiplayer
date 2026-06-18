import { INITIAL_SPEED, MAX_SPEED, ACCELERATION } from '../constants'

export interface PhaseConfig {
  name: string
  minScore: number
  maxScore: number
  speedRange: [number, number]
  spawnInterval: [number, number]
  allowPterodactyl: boolean
}

export const PHASES: PhaseConfig[] = [
  {
    name: 'Calm',
    minScore: 0,
    maxScore: 50,
    speedRange: [400, 500],
    spawnInterval: [1.5, 3],
    allowPterodactyl: false,
  },
  {
    name: 'Rhythm',
    minScore: 50,
    maxScore: 200,
    speedRange: [500, 700],
    spawnInterval: [1.2, 2.5],
    allowPterodactyl: false,
  },
  {
    name: 'Complexity',
    minScore: 200,
    maxScore: 500,
    speedRange: [700, 900],
    spawnInterval: [0.8, 2],
    allowPterodactyl: true,
  },
  {
    name: 'Chaos',
    minScore: 500,
    maxScore: Infinity,
    speedRange: [900, 1200],
    spawnInterval: [0.5, 1.5],
    allowPterodactyl: true,
  },
]

export function getDifficulty(score: number): PhaseConfig {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (score >= PHASES[i].minScore) return PHASES[i]
  }
  return PHASES[0]
}

export function getCurrentSpeed(score: number): number {
  const phase = getDifficulty(score)
  const [phaseMin, phaseMax] = phase.speedRange
  const progress = Math.min(
    1,
    (score - phase.minScore) / Math.max(1, phase.maxScore - phase.minScore)
  )
  const target = phaseMin + (phaseMax - phaseMin) * progress
  const accelerationSpeed = INITIAL_SPEED + score * ACCELERATION
  return Math.min(Math.max(target, accelerationSpeed), MAX_SPEED)
}
