import { render, screen } from '@testing-library/react'
import App from './App'

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

vi.mock('./pages/GamePage', () => ({
  GamePage: () => <div>Game Page</div>,
}))

vi.mock('./pages/RankingPage', () => ({
  RankingPage: () => <div>Rankings Page</div>,
}))

vi.mock('./pages/ProfilePage', () => ({
  ProfilePage: () => <div>Profile Page</div>,
}))

describe('App', () => {
  it('renders navigation links', () => {
    render(<App />)
    expect(screen.getByText('Game')).toBeInTheDocument()
    expect(screen.getByText('Rankings')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('renders game page by default', () => {
    render(<App />)
    expect(screen.getByText('Game Page')).toBeInTheDocument()
  })
})
