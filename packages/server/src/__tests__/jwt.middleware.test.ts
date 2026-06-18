import { describe, it, expect, vi, beforeAll } from 'vitest'
import supertest from 'supertest'
import express from 'express'
import { jwtMiddleware } from '../auth/jwt.middleware.js'

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}))

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use('/api/protected', jwtMiddleware, (_req: any, res: any) => {
    res.json({ user: _req.user })
  })
  return app
}

describe('JWT middleware', () => {
  const app = createTestApp()

  it('should return 401 when no Authorization header', async () => {
    const res = await supertest(app).get('/api/protected')
    expect(res.status).toBe(401)
  })

  it('should return 401 when token is invalid', async () => {
    const res = await supertest(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid-token')
    expect(res.status).toBe(401)
  })

  it('should pass with valid JWT and attach user to req', async () => {
    const jwt = await import('jsonwebtoken')
    const token = jwt.default.sign(
      { id: 'test-id', email: 'test@test.com', displayName: 'Test', avatar: null },
      'dev-secret'
    )

    const res = await supertest(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({
      id: 'test-id',
      email: 'test@test.com',
      displayName: 'Test',
      avatar: null,
    })
  })
})
