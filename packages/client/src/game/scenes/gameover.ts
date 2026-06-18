import type { KaboomCtx } from 'kaplay'
import { emitGameOver } from '../events'

export function createGameOverScene(k: KaboomCtx) {
  k.scene('gameover', () => {
    const score = currentScore

    k.add([
      k.text('Game Over', { size: 48 }),
      k.anchor('center'),
      k.pos(k.width() / 2, k.height() / 2 - 40),
      k.color(k.Color.fromArray([0, 0, 0])),
    ])

    k.add([
      k.text(`Score: ${score}`, { size: 28 }),
      k.anchor('center'),
      k.pos(k.width() / 2, k.height() / 2 + 10),
      k.color(k.Color.fromArray([100, 100, 100])),
    ])

    k.add([
      k.text('Press SPACE to restart', { size: 20 }),
      k.anchor('center'),
      k.pos(k.width() / 2, k.height() / 2 + 50),
      k.color(k.Color.fromArray([160, 160, 160])),
    ])

    const restart = () => k.go('game')
    k.onKeyPress('space', restart)
    k.onClick(restart)
    k.onTouchStart(restart)
  })
}

let currentScore = 0
export function setGameOverScore(score: number) {
  currentScore = score
}
