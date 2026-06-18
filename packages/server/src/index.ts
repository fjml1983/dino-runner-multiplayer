import express from 'express'
import cors from 'cors'
import { authRouter } from './auth/auth.router.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)

export { app }

const PORT = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Dino Runner API running on port ${PORT}`)
  })
}
