import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'

const { mockVerifyIdToken } = vi.hoisted(() => ({
  mockVerifyIdToken: vi.fn(),
}))

const { mockUserUpsert } = vi.hoisted(() => ({
  mockUserUpsert: vi.fn(),
}))

vi.mock('google-auth-library', () => ({
  OAuth2Client: vi.fn(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}))

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: { upsert: mockUserUpsert },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}))

import { app } from '../index.js'

describe('POST /api/auth/google', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 if credential is missing', async () => {
    const res = await supertest(app).post('/api/auth/google').send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should verify Google token and return JWT', async () => {
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-sub-123',
        email: 'user@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      }),
    })

    mockUserUpsert.mockResolvedValue({
      id: 'google-sub-123',
      email: 'user@example.com',
      displayName: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
    })

    const res = await supertest(app)
      .post('/api/auth/google')
      .send({ credential: 'valid-token' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('user')
    expect(res.body.user).toMatchObject({
      id: 'google-sub-123',
      email: 'user@example.com',
      displayName: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
    })
    expect(typeof res.body.token).toBe('string')
  })

  it('should return 401 on invalid Google token', async () => {
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'))

    const res = await supertest(app)
      .post('/api/auth/google')
      .send({ credential: 'invalid-token' })

    expect(res.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  it('should return 401 without token', async () => {
    const res = await supertest(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('should return user data with valid token', async () => {
    const jwt = await import('jsonwebtoken')
    const token = jwt.default.sign(
      { id: 'test-id', email: 'test@test.com', displayName: 'Test User', avatar: null },
      'dev-secret'
    )

    const res = await supertest(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      id: 'test-id',
      email: 'test@test.com',
      displayName: 'Test User',
    })
  })
})
