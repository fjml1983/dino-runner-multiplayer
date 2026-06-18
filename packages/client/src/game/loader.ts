import type { KaboomCtx } from 'kaplay'

export function loadSprites(k: KaboomCtx) {
  k.loadSprite('dino', '/sprites/dino.png')
  k.loadSprite('dino-jump', '/sprites/dino-jump.png')
  k.loadSprite('cactus', '/sprites/cactus.png')
  k.loadSprite('cactus-group', '/sprites/cactus-group.png')
  k.loadSprite('pterodactyl', '/sprites/pterodactyl.png')
  k.loadSprite('ground', '/sprites/ground.png')
  k.loadSprite('shield', '/sprites/shield.png')
  k.loadSprite('slowmo', '/sprites/slowmo.png')
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
