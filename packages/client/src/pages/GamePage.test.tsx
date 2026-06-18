import { render } from '@testing-library/react'
import { GamePage } from './GamePage'

vi.mock('../game/kaplay-init', () => ({
  initKaplay: vi.fn(() => ({
    go: vi.fn(),
    scene: vi.fn(),
    loadSprite: vi.fn(),
    loadSound: vi.fn(),
    destroyAll: vi.fn(),
    setGravity: vi.fn(),
    add: vi.fn(),
    get: vi.fn(),
    onKeyPress: vi.fn(),
    onClick: vi.fn(),
    onTouchStart: vi.fn(),
    onUpdate: vi.fn(),
    dt: vi.fn(() => 0.016),
    width: vi.fn(() => 800),
    height: vi.fn(() => 400),
    LEFT: 0,
    rect: vi.fn(),
    text: vi.fn(),
    pos: vi.fn(),
    color: vi.fn(),
    area: vi.fn(),
    body: vi.fn(),
    move: vi.fn(),
    anchor: vi.fn(),
    z: vi.fn(),
    opacity: vi.fn(),
    play: vi.fn(),
    destroy: vi.fn(),
    rgb: vi.fn(() => ({})),
    Color: { fromArray: vi.fn() },
    vec2: vi.fn(),
  })),
}))

vi.mock('../game/loader', () => ({
  loadSprites: vi.fn(),
  loadSounds: vi.fn(),
}))

vi.mock('../game/scenes/menu', () => ({
  createMenuScene: vi.fn(),
}))

vi.mock('../game/scenes/game', () => ({
  createGameScene: vi.fn(),
}))

vi.mock('../game/scenes/gameover', () => ({
  createGameOverScene: vi.fn(),
}))

describe('GamePage', () => {
  beforeEach(() => {
    delete (window as any).gameAPI
  })

  it('renders canvas element', () => {
    render(<GamePage />)
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('exposes gameAPI on window', () => {
    render(<GamePage />)
    expect(window.gameAPI).toBeDefined()
    expect(typeof window.gameAPI?.startGame).toBe('function')
    expect(typeof window.gameAPI?.pauseGame).toBe('function')
    expect(typeof window.gameAPI?.resumeGame).toBe('function')
  })
})
