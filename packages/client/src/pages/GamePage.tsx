import { useEffect, useRef, useState } from 'react'
import { initKaplay } from '../game/kaplay-init'
import { createMenuScene } from '../game/scenes/menu'
import { createGameScene } from '../game/scenes/game'
import { createGameOverScene } from '../game/scenes/gameover'
import { loadSprites, loadSounds } from '../game/loader'

declare global {
  interface Window {
    gameAPI?: {
      startGame: () => void
      pauseGame: () => void
      resumeGame: () => void
    }
  }
}

export function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('highScore') ?? 0)
  })
  const [gameOver, setGameOver] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [powerUp, setPowerUp] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const k = initKaplay(canvas)
    loadSprites(k)
    loadSounds(k)
    createMenuScene(k)
    createGameScene(k)
    createGameOverScene(k)

    k.go('menu')

    const onGameOver = (e: Event) => {
      const { score: s, final } = (e as CustomEvent).detail
      if (final) {
        setFinalScore(s)
        setGameOver(true)
        if (s > highScore) {
          setHighScore(s)
          localStorage.setItem('highScore', String(s))
        }
      }
    }
    const onPowerUp = (e: Event) => {
      const { type } = (e as CustomEvent).detail
      setPowerUp(type)
      setTimeout(() => setPowerUp(null), 2000)
    }

    window.addEventListener('game:over', onGameOver)
    window.addEventListener('game:powerup', onPowerUp)

    window.gameAPI = {
      startGame: () => k.go('game'),
      pauseGame: () => {},
      resumeGame: () => {},
    }

    return () => {
      window.removeEventListener('game:over', onGameOver)
      window.removeEventListener('game:powerup', onPowerUp)
      delete window.gameAPI
    }
  }, [highScore])

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 800, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      {gameOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
          }}
        >
          <h2>Game Over</h2>
          <p>Score: {finalScore}</p>
          <p>High Score: {highScore}</p>
        </div>
      )}
      {powerUp && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 12px',
            background: powerUp === 'shield' ? '#0066ff' : '#9632c8',
            color: 'white',
            borderRadius: 4,
          }}
        >
          {powerUp === 'shield' ? 'Shield Active!' : 'Slow Motion!'}
        </div>
      )}
    </div>
  )
}
