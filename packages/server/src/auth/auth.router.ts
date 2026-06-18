import { Router, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const router = Router()
const googleClient = new OAuth2Client()
const prisma = new PrismaClient()

router.post('/google', async (req: Request, res: Response) => {
  try {
    const { credential } = req.body
    if (!credential) {
      res.status(400).json({ error: 'Missing credential' })
      return
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.sub) {
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    const user = await prisma.user.upsert({
      where: { id: payload.sub },
      update: {
        displayName: payload.name || 'Unknown',
        avatar: payload.picture || null,
      },
      create: {
        id: payload.sub,
        email: payload.email || '',
        displayName: payload.name || 'Unknown',
        avatar: payload.picture || null,
      },
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, displayName: user.displayName, avatar: user.avatar },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )

    res.json({ token })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ error: 'Authentication failed' })
  }
})

export { router as authRouter }
