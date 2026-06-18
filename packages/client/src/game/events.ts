export function emitScore(score: number) {
  window.dispatchEvent(new CustomEvent('game:score', { detail: { score } }))
}

export function emitGameOver(score: number) {
  window.dispatchEvent(new CustomEvent('game:over', { detail: { score, final: true } }))
}

export function emitPowerUp(type: string) {
  window.dispatchEvent(new CustomEvent('game:powerup', { detail: { type } }))
}
