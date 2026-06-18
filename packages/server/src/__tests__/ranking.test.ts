import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'

const { mockScoreFindMany, mockScoreGroupBy } = vi.hoisted(() => ({
  mockScoreFindMany: vi.fn(),
  mockScoreGroupBy: vi.fn(),
}))

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    score: {
      findMany: mockScoreFindMany,
      groupBy: mockScoreGroupBy,
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}))

import { app } from '../index.js'

describe('GET /api/ranking/current', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return top 25 scores for current week', async () => {
    const scores = [
      { value: 100, weekId: '2026-W25', userId: 'u1', user: { displayName: 'Alice', avatar: null } },
    ]
    mockScoreFindMany.mockResolvedValue(scores)

    const res = await supertest(app).get('/api/ranking/current')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].user.displayName).toBe('Alice')
  })

  it('should return empty array when no scores exist', async () => {
    mockScoreFindMany.mockResolvedValue([])

    const res = await supertest(app).get('/api/ranking/current')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('GET /api/ranking/week/:weekId', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return top 25 scores for given week', async () => {
    const scores = [
      { value: 100, weekId: '2026-W24', userId: 'u1', user: { displayName: 'Bob', avatar: null } },
    ]
    mockScoreFindMany.mockResolvedValue(scores)

    const res = await supertest(app).get('/api/ranking/week/2026-W24')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].weekId).toBe('2026-W24')
  })
})

describe('GET /api/ranking/all', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return top 25 distinct users by best score', async () => {
    const rankings = [
      { userId: 'u1', value: 200, user: { displayName: 'Alice', avatar: null } },
    ]
    mockScoreFindMany.mockResolvedValue(rankings)

    const res = await supertest(app).get('/api/ranking/all')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  })
})

describe('GET /api/ranking/weeks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return distinct weekIds sorted desc', async () => {
    mockScoreGroupBy.mockResolvedValue([
      { weekId: '2026-W26' },
      { weekId: '2026-W25' },
    ])

    const res = await supertest(app).get('/api/ranking/weeks')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })

  it('should return empty array when no scores', async () => {
    mockScoreGroupBy.mockResolvedValue([])

    const res = await supertest(app).get('/api/ranking/weeks')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})
