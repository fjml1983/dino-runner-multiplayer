import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function createPNG(width, height, r, g, b) {
  const crcTable = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    }
    crcTable[n] = c
  }

  const crc32 = (data) => {
    let c = 0xffffffff
    for (let i = 0; i < data.length; i++) {
      c = (c >>> 8) ^ crcTable[(c ^ data[i]) & 0xff]
    }
    return (c ^ 0xffffffff) >>> 0
  }

  const makeChunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const typeB = Buffer.from(type, 'ascii')
    const crcData = Buffer.concat([typeB, data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(crcData))
    return Buffer.concat([len, typeB, data, crc])
  }

  const deflate = (data) => {
    const blocks = []
    let i = 0
    while (i < data.length) {
      const final = i + 65535 >= data.length ? 1 : 0
      const chunk = data.slice(i, i + 65535)
      const len = chunk.length
      const hdr = Buffer.alloc(5)
      hdr[0] = final ? 0x01 : 0x00
      hdr.writeUInt16LE(len & 0xffff, 1)
      hdr.writeUInt16LE((~len) & 0xffff, 3)
      blocks.push(Buffer.concat([hdr, chunk]))
      i += len
    }
    return Buffer.concat(blocks)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const rawData = Buffer.alloc(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3)
    rawData[rowStart] = 0
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 3
      rawData[px] = r
      rawData[px + 1] = g
      rawData[px + 2] = b
    }
  }

  const compressed = deflate(rawData)

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ])
}

const sprites = {
  'dino.png':        { w: 40, h: 50, r: 80,  g: 80,  b: 80  },
  'dino-jump.png':   { w: 40, h: 50, r: 100, g: 100, b: 100 },
  'cactus.png':      { w: 30, h: 40, r: 60,  g: 180, b: 60  },
  'cactus-group.png':{ w: 50, h: 40, r: 40,  g: 140, b: 40  },
  'pterodactyl.png': { w: 40, h: 30, r: 200, g: 100, b: 100 },
  'ground.png':      { w: 64, h: 40, r: 160, g: 160, b: 160 },
  'shield.png':      { w: 24, h: 24, r: 0,   g: 100, b: 255 },
  'slowmo.png':      { w: 24, h: 24, r: 150, g: 50,  b: 200 },
}

const outDir = resolve(__dirname, '../packages/client/public/sprites')
mkdirSync(outDir, { recursive: true })

for (const [name, { w, h, r, g, b }] of Object.entries(sprites)) {
  const png = createPNG(w, h, r, g, b)
  writeFileSync(resolve(outDir, name), png)
  console.log(`✓ ${name} (${w}x${h})`)
}

console.log('\nAll sprites generated!')
