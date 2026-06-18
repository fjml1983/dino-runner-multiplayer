import path from 'path'
import express from 'express'
import cors from 'cors'
import { prisma } from './db.js'
import { authRouter } from './auth/auth.router.js'
import { scoresRouter } from './scores/scores.router.js'
import { rankingRouter } from './ranking/ranking.router.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/scores', scoresRouter)
app.use('/api/ranking', rankingRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
  })
}

export { app }

const PORT = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'test') {
  prisma.$connect().then(() => {
    app.listen(PORT, () => {
      console.log(`Dino Runner API running on port ${PORT}`)
    })
  })
}
