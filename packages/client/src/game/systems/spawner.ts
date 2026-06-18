import type { KAPLAYCtx, GameObj } from 'kaplay'
import { getDifficulty } from './difficulty'
import type { PhaseConfig } from './difficulty'

export interface SpawnPattern {
  type: 'cactus' | 'cactus-group' | 'pterodactyl'
  count: number
}

export function getPatternsForPhase(phase: PhaseConfig): SpawnPattern[] {
  if (phase.name === 'Calm') {
    return [
      { type: 'cactus', count: 1 },
      { type: 'cactus', count: 1 },
      { type: 'cactus-group', count: 2 },
    ]
  }
  if (phase.name === 'Rhythm') {
    return [
      { type: 'cactus', count: 1 },
      { type: 'cactus', count: 2 },
      { type: 'cactus', count: 1 },
    ]
  }
  if (phase.name === 'Complexity') {
    return [
      { type: 'cactus', count: 1 },
      { type: 'cactus-group', count: 3 },
      { type: 'pterodactyl', count: 1 },
    ]
  }
  return [
    { type: 'cactus', count: 2 },
    { type: 'pterodactyl', count: 1 },
    { type: 'cactus-group', count: 4 },
    { type: 'pterodactyl', count: 2 },
  ]
}

export function pickPattern(phase: PhaseConfig): SpawnPattern {
  const patterns = getPatternsForPhase(phase)
  return patterns[Math.floor(Math.random() * patterns.length)]
}

let spawnTimer = 0

export function resetSpawner() {
  spawnTimer = 0
}

export function updateSpawner(
  _k: KAPLAYCtx,
  dt: number,
  score: number,
  speed: number,
  _obstacles: GameObj[],
  addObstacle: (pattern: SpawnPattern, speed: number) => void
) {
  const phase = getDifficulty(score)
  const [minInterval, maxInterval] = phase.spawnInterval
  const interval = minInterval + Math.random() * (maxInterval - minInterval)

  spawnTimer += dt
  if (spawnTimer >= interval) {
    spawnTimer = 0
    const pattern = pickPattern(phase)
    addObstacle(pattern, speed)
  }
}
