import type { KaboomCtx } from 'kaplay'

export function loadSprites(k: KaboomCtx) {
  const sprites = [
    'dino', 'dino-jump', 'cactus', 'cactus-group',
    'pterodactyl', 'ground', 'shield', 'slowmo',
  ]
  for (const name of sprites) {
    k.loadSprite(name, `/sprites/${name}.png`).catch(() => {
      // sprites not loaded yet — game uses rectangles as fallback
    })
  }
}

export function loadSounds(k: KaboomCtx) {
  try {
    k.loadSound('jump', '/sounds/jump.mp3')
    k.loadSound('collision', '/sounds/collision.mp3')
    k.loadSound('powerup', '/sounds/powerup.mp3')
    k.loadSound('shield-break', '/sounds/shield-break.mp3')
    k.loadSound('slowmo', '/sounds/slowmo.mp3')
  } catch {
    console.warn('Sound files not found, continuing without audio')
  }
}
