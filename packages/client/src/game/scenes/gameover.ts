import type { KAPLAYCtx } from 'kaplay'

export function createGameOverScene(k: KAPLAYCtx) {
  k.scene('gameover', (data: { score?: number }) => {
    const score = data?.score ?? 0

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
