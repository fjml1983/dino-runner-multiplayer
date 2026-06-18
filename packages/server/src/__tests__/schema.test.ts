import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import path from 'path'
import fs from 'fs'

const TEST_DB_PATH = path.join(__dirname, '../../prisma/test.db')
const TEST_DB_URL = `file:${TEST_DB_PATH}`

let prisma: PrismaClient

describe('Prisma Schema', () => {
  beforeAll(async () => {
    process.env.DATABASE_URL = TEST_DB_URL
    execSync('npx prisma db push --skip-generate', {
      cwd: path.join(__dirname, '../..'),
      env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    })
    prisma = new PrismaClient({
      datasources: { db: { url: TEST_DB_URL } },
    })
    await prisma.$connect()
  })

  afterAll(async () => {
    if (prisma) await prisma.$disconnect()
    try {
      if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH)
      const journalPath = TEST_DB_PATH + '-journal'
      if (fs.existsSync(journalPath)) fs.unlinkSync(journalPath)
    } catch { /* ignore cleanup errors */ }
  })

  it('should create a user and a score', async () => {
    const user = await prisma.user.create({
      data: {
        id: 'google-sub-1',
        email: 'test@example.com',
        displayName: 'Test User',
      },
    })
    expect(user.id).toBe('google-sub-1')
    expect(user.email).toBe('test@example.com')
    expect(user.displayName).toBe('Test User')

    const score = await prisma.score.create({
      data: {
        value: 100,
        weekId: '2026-W25',
        userId: user.id,
      },
    })
    expect(score.value).toBe(100)
    expect(score.weekId).toBe('2026-W25')
    expect(score.userId).toBe(user.id)
  })

  it('should enforce unique constraint on userId and weekId', async () => {
    const user = await prisma.user.create({
      data: {
        id: 'google-sub-2',
        email: 'test2@example.com',
        displayName: 'Test User 2',
      },
    })

    await prisma.score.create({
      data: {
        value: 100,
        weekId: '2026-W25',
        userId: user.id,
      },
    })

    await expect(
      prisma.score.create({
        data: {
          value: 200,
          weekId: '2026-W25',
          userId: user.id,
        },
      })
    ).rejects.toThrow()
  })
})
