vi.mock('kaplay', () => ({
  default: vi.fn(() => ({
    loadSprite: vi.fn(),
    loadSound: vi.fn(),
    scene: vi.fn(),
    start: vi.fn(),
    go: vi.fn(),
    onKeyPress: vi.fn(),
    onClick: vi.fn(),
    add: vi.fn(),
    get: vi.fn(),
    destroyAll: vi.fn(),
    camScale: vi.fn(),
    vec2: vi.fn((x: number, y: number) => ({ x, y })),
    rgb: vi.fn(() => ({})),
    Color: vi.fn(),
  })),
}))

import { initKaplay } from './kaplay-init'

describe('initKaplay', () => {
  it('creates a kaplay context from a canvas element', () => {
    const canvas = document.createElement('canvas')
    const k = initKaplay(canvas)
    expect(k).toBeDefined()
    expect(k.go).toBeDefined()
    expect(k.scene).toBeDefined()
  })
})
