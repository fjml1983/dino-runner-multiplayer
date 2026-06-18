import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { jwtMiddleware } from '../auth/jwt.middleware.js'

const router = Router()
const prisma = new PrismaClient()

router.post('/', jwtMiddleware, async (req: Request, res: Response) => {
  try {
    const { value, weekId } = req.body
    const userId = req.user!.id

    const existing = await prisma.score.findUnique({
      where: { userId_weekId: { userId, weekId } },
    })

    if (existing) {
      if (value > existing.value) {
        const updated = await prisma.score.update({
          where: { id: existing.id },
          data: { value },
        })
        res.json(updated)
        return
      }
      res.json(existing)
      return
    }

    const score = await prisma.score.create({
      data: { value, weekId, userId },
    })
    res.status(201).json(score)
  } catch (error) {
    console.error('Score error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as scoresRouter }
