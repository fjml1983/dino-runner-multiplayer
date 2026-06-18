import type { KaboomCtx } from 'kaplay'

export function createMenuScene(k: KaboomCtx) {
  k.scene('menu', () => {
    k.add([
      k.text('Dino Runner', { size: 48 }),
      k.anchor('center'),
      k.pos(k.width() / 2, k.height() / 2 - 40),
      k.color(k.Color.fromArray([0, 0, 0])),
    ])

    k.add([
      k.text('Press SPACE or tap to start', { size: 20 }),
      k.anchor('center'),
      k.pos(k.width() / 2, k.height() / 2 + 30),
      k.color(k.Color.fromArray([100, 100, 100])),
    ])

    const startGame = () => k.go('game')

    k.onKeyPress('space', startGame)
    k.onClick(startGame)
    k.onTouchStart(startGame)
  })
}
