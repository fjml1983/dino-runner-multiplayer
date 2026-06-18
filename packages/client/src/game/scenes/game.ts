import type { KaboomCtx } from 'kaplay'
import { GRAVITY, JUMP_FORCE, INITIAL_SPEED } from '../constants'
import { getDifficulty, getCurrentSpeed } from '../systems/difficulty'
import { updateSpawner, resetSpawner, type SpawnPattern } from '../systems/spawner'
import { emitScore, emitGameOver, emitPowerUp } from '../events'

let currentScore = 0
let gameSpeed = INITIAL_SPEED
let isGameOver = false
let shieldActive = false
let shieldTimer = 0
let slowmoActive = false
let slowmoTimer = 0
let normalSpeed = INITIAL_SPEED

export function createGameScene(k: KaboomCtx) {
  k.scene('game', () => {
    currentScore = 0
    gameSpeed = INITIAL_SPEED
    isGameOver = false
    shieldActive = false
    shieldTimer = 0
    slowmoActive = false
    slowmoTimer = 0
    normalSpeed = INITIAL_SPEED
    resetSpawner()

    k.setGravity(GRAVITY)

    const ground = k.add([
      k.rect(k.width(), 40),
      k.pos(0, k.height() - 40),
      k.color(k.Color.fromArray([160, 160, 160])),
      k.area(),
      k.body({ isStatic: true }),
    ])

    const player = k.add([
      k.sprite('dino'),
      k.pos(80, ground.pos.y - 50),
      k.area(),
      k.body(),
      k.z(10),
      {
        isJumping: false,
        width: 40,
        height: 50,
      },
    ])

    const scoreLabel = k.add([
      k.text('0', { size: 24 }),
      k.pos(k.width() - 100, 20),
      k.color(k.Color.fromArray([0, 0, 0])),
      k.z(20),
    ])

    let shieldOverlay: ReturnType<KaboomCtx['add']> | null = null
    let slowmoOverlay: ReturnType<KaboomCtx['add']> | null = null

    const addObstacle = (pattern: SpawnPattern, speed: number) => {
      const spriteName = pattern.type === 'pterodactyl' ? 'pterodactyl'
        : pattern.type === 'cactus-group' ? 'cactus-group'
        : 'cactus'

      const obs = k.add([
        k.sprite(spriteName),
        k.pos(k.width(), ground.pos.y - 40),
        k.area(),
        k.move(k.LEFT, speed),
        k.z(5),
        'obstacle',
        { pattern },
      ])

      if (pattern.type === 'pterodactyl') {
        obs.pos.y = ground.pos.y - 80
      }
    }

    const addShieldPickup = () => {
      if (shieldActive) return
      k.add([
        k.sprite('shield'),
        k.pos(k.width(), ground.pos.y - 60),
        k.area(),
        k.move(k.LEFT, gameSpeed),
        k.z(5),
        { isPowerUp: true, powerType: 'shield' },
      ])
    }

    const addSlowmoPickup = () => {
      if (slowmoActive) return
      k.add([
        k.sprite('slowmo'),
        k.pos(k.width(), ground.pos.y - 60),
        k.area(),
        k.move(k.LEFT, gameSpeed),
        k.z(5),
        { isPowerUp: true, powerType: 'slowmo' },
      ])
    }

    const cleanup = () => {
      k.destroyAll('obstacle')
      k.destroyAll('powerup')
    }

    const handleCollision = () => {
      if (isGameOver) return

      if (shieldActive) {
        shieldActive = false
        shieldTimer = 0
        if (shieldOverlay) {
          k.destroy(shieldOverlay)
          shieldOverlay = null
        }
        try {
          k.play('shield-break')
        } catch { /* no audio */ }
        return
      }

      isGameOver = true
      try {
        k.play('collision')
      } catch { /* no audio */ }
      emitGameOver(currentScore)
      k.go('gameover', { score: currentScore })
    }

    player.onCollide((obj) => {
      if (obj.is('obstacle') || obj.isPowerUp === true) {
        if (obj.isPowerUp) {
          if (obj.powerType === 'shield') {
            shieldActive = true
            shieldTimer = 5
            try { k.play('powerup') } catch { /* no audio */ }
            emitPowerUp('shield')
            if (shieldOverlay) k.destroy(shieldOverlay)
            shieldOverlay = k.add([
              k.rect(player.width + 10, player.height + 10),
              k.pos(player.pos.x - 5, player.pos.y - 5),
              k.color(k.Color.fromArray([0, 100, 255, 0.3])),
              k.z(11),
              k.opacity(0.3),
            ])
          } else if (obj.powerType === 'slowmo') {
            slowmoActive = true
            slowmoTimer = 3
            normalSpeed = gameSpeed
            gameSpeed *= 0.4
            try { k.play('powerup') } catch { /* no audio */ }
            emitPowerUp('slowmo')
            slowmoOverlay = k.add([
              k.rect(k.width(), k.height()),
              k.pos(0, 0),
              k.color(k.Color.fromArray([150, 50, 200, 0.15])),
              k.z(50),
              k.opacity(0.15),
            ])
          }
          k.destroy(obj)
          return
        }
        handleCollision()
      }
    })

    player.onUpdate(() => {
      if (isGameOver) return
      if (player.pos.y >= ground.pos.y - player.height) {
        player.isJumping = false
      }
    })

    const jump = () => {
      if (isGameOver) return
      if (!player.isJumping && player.pos.y >= ground.pos.y - player.height - 1) {
        player.jump(JUMP_FORCE)
        player.isJumping = true
        try { k.play('jump') } catch { /* no audio */ }
      }
    }

    k.onKeyPress('space', jump)
    k.onClick(jump)
    k.onTouchStart(jump)

    let powerupSpawnTimer = 0

    k.onUpdate(() => {
      if (isGameOver) return

      const dt = k.dt()
      currentScore += Math.floor(dt * 10)

      if (!slowmoActive) {
        const phase = getDifficulty(currentScore)
        gameSpeed = getCurrentSpeed(currentScore)
      }

      scoreLabel.text = String(currentScore)
      emitScore(currentScore)

      updateSpawner(k, dt, currentScore, gameSpeed, [], addObstacle)

      powerupSpawnTimer += dt
      if (powerupSpawnTimer > 5 && !shieldActive && !slowmoActive) {
        powerupSpawnTimer = 0
        if (Math.random() < 0.7) {
          addShieldPickup()
        } else {
          addSlowmoPickup()
        }
      }

      if (shieldActive) {
        shieldTimer -= dt
        if (shieldTimer <= 0) {
          shieldActive = false
          if (shieldOverlay) {
            k.destroy(shieldOverlay)
            shieldOverlay = null
          }
        } else if (shieldOverlay) {
          shieldOverlay.pos.x = player.pos.x - 5
          shieldOverlay.pos.y = player.pos.y - 5
        }
      }

      if (slowmoActive) {
        slowmoTimer -= dt
        if (slowmoTimer <= 0) {
          slowmoActive = false
          gameSpeed = normalSpeed
          if (slowmoOverlay) {
            k.destroy(slowmoOverlay)
            slowmoOverlay = null
          }
        }
      }
    })

    window.gameAPI = {
      startGame: () => {},
      pauseGame: () => {},
      resumeGame: () => {},
    }

    cleanup()
  })
}
