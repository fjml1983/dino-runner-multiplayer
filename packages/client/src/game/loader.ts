import type { KAPLAYCtx } from 'kaplay'

export function loadSprites(k: KAPLAYCtx) {
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

export function loadSounds(k: KAPLAYCtx) {
  try {
    k.loadSound('jump', '/sounds/jump.wav')
    k.loadSound('collision', '/sounds/collision.wav')
    k.loadSound('powerup', '/sounds/powerup.wav')
    k.loadSound('shield-break', '/sounds/shield-break.wav')
  } catch {
    console.warn('Sound files not found, continuing without audio')
  }
}
