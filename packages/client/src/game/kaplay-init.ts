import kaplay from 'kaplay'

export function initKaplay(canvas: HTMLCanvasElement) {
  const k = kaplay({
    canvas,
    width: 800,
    height: 400,
    background: [255, 255, 255],
    global: false,
    debug: false,
  })

  return k
}
