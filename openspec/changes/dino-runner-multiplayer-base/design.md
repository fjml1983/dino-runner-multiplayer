## Context

A greenfield project — an endless-runner game (Chrome Dino clone) with Google OAuth, persistent score tracking per user, and ranked leaderboards. The frontend uses React for UI and Kaplay for the game canvas. The backend is Express + Prisma with SQLite, deployable as a single Railway service.

## Goals / Non-Goals

**Goals:**
- Fully playable dino runner with jump mechanics, procedural obstacles, and 2 power-ups
- Google OAuth login via popup with JWT session
- Score persistence: one entry per user per ISO week (upsert keeps best)
- Leaderboard: top 25 global all-time, current week, historical weeks
- Monorepo with npm workspaces: one `npm install`, one `npm run dev`
- Deploy as single Railway service (Express serves API + built frontend)

**Non-Goals:**
- No email/password registration
- No real-time multiplayer (no WebSocket, no phantom players)
- No sounds beyond jump, collision, power-up (no background music)
- No duck/roll mechanic (pterodactyls always at jumpable height)
- No admin panel or moderation tools

## Decisions

### 1. Kaplay + React via Event Bus (Model 1)
React owns the DOM, Kaplay owns the `<canvas>`. Communication through `window.dispatchEvent` custom events and a `window.gameAPI` object.
**Why**: Kaplay scenes handle game state naturally; React handles UI state (login, ranking, overlays). The event bus keeps them decoupled.

### 2. Two power-ups: Shield and Slow-mo
- **Shield**: 70% spawn probability, absorbs 1 collision, 5s duration, blue aura
- **Slow-mo**: 30% spawn probability, 60% speed reduction for 3s, purple tint
**Why**: Shield is forgiving for casual play; slow-mo creates clutch moments. Two is enough depth without complexity.

### 3. Progressive difficulty with phases
Four phases: Calm (0-50), Rhythm (50-200), Complexity (200-500), Chaos (500+). Speed ramps from 400 to 1200 px/s. Obstacle patterns are drawn from phase-specific pools.
**Why**: Micro-mesetas give the player breathing room. Pattern-based spawning feels designed rather than random.

### 4. One score per user per ISO week
`@@unique([userId, weekId])` in Prisma. On submission: if a score exists for that user+week, update only if new score is higher.
**Why**: Fair leaderboard, simple model, easy to query.

### 5. Monorepo with npm workspaces
Root `package.json` with `"workspaces": ["packages/*"]`. Shared `tsconfig.base.json`. Dev via `concurrently`.
**Why**: Single install, single dev command, easy type sharing, Railway can deploy as one service.

### 6. SQLite → MySQL via Prisma
Start with SQLite (zero infrastructure, Railway volumes). Provider swap later for scale.
**Why**: Cost and complexity = $0. Prisma abstracts the difference.

### 7. Railway single-service deployment
Express serves API routes under `/api/*` and static frontend build for all other routes.
**Why**: One service to deploy, no CORS, free tier with $5 credit.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Monorepo: dino-runner-multiplayer-base                     │
│                                                             │
│  packages/client/                      packages/server/     │
│  ┌──────────────────────────┐        ┌─────────────────┐   │
│  │  Vite + React + Kaplay   │        │  Express + Prisma│   │
│  │                          │        │  + SQLite        │   │
│  │  Pages:                  │        │                  │   │
│  │   /  → GamePage          │  HTTP  │  Routes:         │   │
│  │   /ranking → RankingPage │◀──────▶│   /api/auth/*    │   │
│  │   /profile → ProfilePage │        │   /api/scores/*  │   │
│  │                          │        │   /api/ranking/* │   │
│  │  Event Bus:              │        │                  │   │
│  │   game:score             │        │  Prisma Schema:  │   │
│  │   game:over              │        │   User            │   │
│  │   game:powerup           │        │   Score           │   │
│  │                          │        │   @@unique(userId,│   │
│  │  gameAPI: start/pause    │        │     weekId)      │   │
│  └──────────────────────────┘        └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Model

```prisma
model User {
  id          String   @id              // google sub
  email       String   @unique
  displayName String
  avatar      String?
  createdAt   DateTime @default(now())
  scores      Score[]
}

model Score {
  id         Int      @id @default(autoincrement())
  value      Int
  weekId     String                       // "2026-W25"
  achievedAt DateTime @default(now())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  @@unique([userId, weekId])
}
```

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/google | No | Verify Google token, upsert user, return JWT |
| GET | /api/auth/me | Yes | Current user info |
| POST | /api/scores | Yes | Submit score (upsert per week) |
| GET | /api/scores/me | Yes | User's score history |
| GET | /api/ranking/current | No | Top 25 current ISO week |
| GET | /api/ranking/week/:weekId | No | Top 25 specific week |
| GET | /api/ranking/all | No | Top 25 global all-time |
| GET | /api/ranking/weeks | No | List available weeks |

## Game Constants

```
GRAVEDAD     = 2400  px/s²
VEL_INICIAL  = 400   px/s
VEL_MAX      = 1200  px/s
FUERZA_SALTO = -700  px/s
ACELERACION  = 8     px/s² (cada segundo)

Dificultad por fase:
  Calm:       0-50   400-500  solo cactus
  Rhythm:     50-200 500-700  cactus, gaps variables
  Complexity: 200-500 700-900  cactus + pteros, combos
  Chaos:      500+   900-1200  todo, alta densidad

Power-ups:
  Shield:  prob 70%, 5s, absorbe 1 golpe
  Slow-mo: prob 30%, 3s, speed *= 0.4
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| SQLite write contention under concurrent users | Railway single-instance; SQLite WAL mode; Prisma connection pooling |
| Kaplay + React event bus can get messy at scale | Keep events minimal (score, over, powerup). One-directional: Kaplay emits → React reads |
| Google OAuth popup blockers | Fallback redirect mode if popup blocked |
| No duck mechanic limits pterodactyl design | Pteros always at jump height — consistent, simple |
| Sprites may need attribution | Use CC0 assets from OpenGameArt; document sources in README |
