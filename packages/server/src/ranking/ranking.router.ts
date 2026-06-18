import { Router, Request, Response } from 'express'
import { prisma } from '../db.js'
import { getCurrentWeekId } from '../utils/week.js'

const router = Router()

router.get('/current', async (_req: Request, res: Response) => {
  try {
    const weekId = getCurrentWeekId()
    const scores = await prisma.score.findMany({
      where: { weekId },
      orderBy: { value: 'desc' },
      take: 25,
      include: { user: { select: { displayName: true, avatar: true } } },
    })
    res.json(scores)
  } catch (error) {
    console.error('Ranking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/week/:weekId', async (req: Request, res: Response) => {
  try {
    const weekId = req.params.weekId as string
    const scores = await prisma.score.findMany({
      where: { weekId },
      orderBy: { value: 'desc' },
      take: 25,
      include: { user: { select: { displayName: true, avatar: true } } },
    })
    res.json(scores)
  } catch (error) {
    console.error('Ranking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/all', async (_req: Request, res: Response) => {
  try {
    const rankings = await prisma.score.findMany({
      orderBy: { value: 'desc' },
      take: 25,
      distinct: ['userId'],
      include: { user: { select: { displayName: true, avatar: true } } },
    })
    res.json(rankings)
  } catch (error) {
    console.error('Ranking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/weeks', async (_req: Request, res: Response) => {
  try {
    const weeks = await prisma.score.groupBy({
      by: ['weekId'],
      orderBy: { weekId: 'desc' },
    })
    res.json(weeks.map((w) => w.weekId))
  } catch (error) {
    console.error('Ranking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as rankingRouter }
