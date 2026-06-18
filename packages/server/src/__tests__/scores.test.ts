import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'

const { mockScoreUpsert, mockScoreFindUnique, mockScoreFindMany, mockScoreCreate, mockScoreUpdate } = vi.hoisted(() => ({
  mockScoreUpsert: vi.fn(),
  mockScoreFindUnique: vi.fn(),
  mockScoreFindMany: vi.fn(),
  mockScoreCreate: vi.fn(),
  mockScoreUpdate: vi.fn(),
}))

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    score: {
      upsert: mockScoreUpsert,
      findUnique: mockScoreFindUnique,
      findMany: mockScoreFindMany,
      create: mockScoreCreate,
      update: mockScoreUpdate,
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}))

import { app } from '../index.js'

function getAuthToken(): string {
  const jwt = require('jsonwebtoken')
  return jwt.sign(
    { id: 'user-1', email: 'user@test.com', displayName: 'User', avatar: null },
    'dev-secret'
  )
}

describe('POST /api/scores', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 without auth', async () => {
    const res = await supertest(app)
      .post('/api/scores')
      .send({ value: 100, weekId: '2026-W25' })

    expect(res.status).toBe(401)
  })

  it('should create a new score', async () => {
    mockScoreFindUnique.mockResolvedValue(null)
    mockScoreCreate.mockResolvedValue({
      id: 1,
      value: 100,
      weekId: '2026-W25',
      userId: 'user-1',
    })

    const res = await supertest(app)
      .post('/api/scores')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({ value: 100, weekId: '2026-W25' })

    expect(res.status).toBe(201)
    expect(res.body.value).toBe(100)
  })

  it('should update when new score is higher', async () => {
    mockScoreFindUnique.mockResolvedValue({ id: 1, value: 50, weekId: '2026-W25', userId: 'user-1' })
    mockScoreUpdate.mockResolvedValue({ id: 1, value: 100, weekId: '2026-W25', userId: 'user-1' })

    const res = await supertest(app)
      .post('/api/scores')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({ value: 100, weekId: '2026-W25' })

    expect(res.status).toBe(200)
    expect(res.body.value).toBe(100)
  })

  it('should not update when new score is lower or equal', async () => {
    mockScoreFindUnique.mockResolvedValue({ id: 1, value: 100, weekId: '2026-W25', userId: 'user-1' })

    const res = await supertest(app)
      .post('/api/scores')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({ value: 50, weekId: '2026-W25' })

    expect(res.status).toBe(200)
    expect(res.body.value).toBe(100)
    expect(mockScoreCreate).not.toHaveBeenCalled()
    expect(mockScoreUpdate).not.toHaveBeenCalled()
  })
})
