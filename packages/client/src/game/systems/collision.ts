import type { GameObj } from 'kaplay'

export function checkAABB(a: GameObj, b: GameObj): boolean {
  return (
    a.pos.x < b.pos.x + b.width &&
    a.pos.x + a.width > b.pos.x &&
    a.pos.y < b.pos.y + b.height &&
    a.pos.y + a.height > b.pos.y
  )
}
