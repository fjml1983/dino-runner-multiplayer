import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import jsfxr from 'jsfxr'

const __dirname = dirname(fileURLToPath(import.meta.url))

function createWav(samples, sampleRate = 44100) {
  const numChannels = 1
  const bitsPerSample = 16
  const byteRate = sampleRate * numChannels * bitsPerSample / 8
  const blockAlign = numChannels * bitsPerSample / 8
  const dataSize = samples.length * blockAlign
  const headerSize = 44
  const buf = Buffer.alloc(headerSize + dataSize)

  // RIFF header
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + dataSize, 4)
  buf.write('WAVE', 8)

  // fmt chunk
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)        // chunk size
  buf.writeUInt16LE(1, 20)         // PCM format
  buf.writeUInt16LE(numChannels, 22)
  buf.writeUInt32LE(sampleRate, 24)
  buf.writeUInt32LE(byteRate, 28)
  buf.writeUInt16LE(blockAlign, 32)
  buf.writeUInt16LE(bitsPerSample, 34)

  // data chunk
  buf.write('data', 36)
  buf.writeUInt32LE(dataSize, 40)

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    const val = s < 0 ? s * 0x8000 : s * 0x7fff
    buf.writeInt16LE(Math.round(val), headerSize + i * 2)
  }

  return buf
}

function configureParams(params, type) {
  switch (type) {
    case 'jump':
      // Quick upward blip
      params.waveType = 0         // square
      params.pEnvSustain = 0.1
      params.pEnvAttack = 0.01
      params.pEnvDecay = 0.1
      params.startFrequency = 350
      params.minFrequency = 600
      params.frequencyRamp = 0.5
      params.dutyRamp = 0
      params.vibStrength = 0
      params.vibSpeed = 0
      params.arpeggioSpeed = 0
      params.arpeggioAmount = 0
      break

    case 'collision':
      // Low thud
      params.waveType = 3         // noise
      params.pEnvSustain = 0.05
      params.pEnvAttack = 0.01
      params.pEnvDecay = 0.2
      params.startFrequency = 100
      params.minFrequency = 50
      params.frequencyRamp = -0.5
      break

    case 'powerup':
      // Bright ding
      params.waveType = 1         // sawtooth
      params.pEnvSustain = 0.08
      params.pEnvAttack = 0.01
      params.pEnvDecay = 0.15
      params.startFrequency = 500
      params.minFrequency = 800
      params.frequencyRamp = 0.3
      params.vibStrength = 0.2
      params.vibSpeed = 0.5
      break

    case 'shield-break':
      // Short crackle
      params.waveType = 3         // noise
      params.pEnvSustain = 0.03
      params.pEnvAttack = 0.01
      params.pEnvDecay = 0.1
      params.startFrequency = 200
      params.minFrequency = 100
      params.frequencyRamp = -0.3
      break
  }
}

const sounds = ['jump', 'collision', 'powerup', 'shield-break']
const outDir = resolve(__dirname, '../packages/client/public/sounds')
mkdirSync(outDir, { recursive: true })

for (const name of sounds) {
  const params = new jsfxr.Params()
  configureParams(params, name)
  const sfx = new jsfxr.SoundEffect(params)
  const buf = sfx.getRawBuffer()
  const wav = createWav(buf.normalized)
  writeFileSync(resolve(outDir, `${name}.wav`), wav)
  console.log(`✓ ${name}.wav (${(wav.length / 1024).toFixed(1)} KB)`)
}

console.log('\nAll sounds generated!')
