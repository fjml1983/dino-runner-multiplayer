import { emitScore, emitGameOver, emitPowerUp } from './events'

describe('game events', () => {
  it('emitScore dispatches game:score with correct detail', () => {
    const handler = vi.fn()
    window.addEventListener('game:score', handler)
    emitScore(42)
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { score: 42 },
      })
    )
  })

  it('emitGameOver dispatches game:over with correct detail', () => {
    const handler = vi.fn()
    window.addEventListener('game:over', handler)
    emitGameOver(100)
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { score: 100, final: true },
      })
    )
  })

  it('emitPowerUp dispatches game:powerup with correct detail', () => {
    const handler = vi.fn()
    window.addEventListener('game:powerup', handler)
    emitPowerUp('shield')
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { type: 'shield' },
      })
    )
  })
})
