## Why

The Chrome Dinosaur game is universally recognized but purely single-player — there's no persistence, no progression, and no social layer. This change builds a multiplayer-enabled version with Google OAuth, persistent score tracking per user, and a ranked leaderboard with historical weekly views. It turns a casual time-waster into a competitive, account-based experience.

## What Changes

- New frontend: Vite + React + TypeScript with Kaplay (ex-Kaboom) for game canvas
- New backend: Express.js + Prisma + SQLite (swappable to MySQL later)
- Google OAuth login via popup (no email/password flow)
- Dino runner game with 2 power-ups (shield, slow-mo), progressive difficulty curve, and procedural obstacle patterns
- Score submission: one entry per user per ISO week (upsert: only keeps best)
- Ranking API: top 25 global all-time, top 25 current ISO week, historical weekly top 25
- Mobile support: touch to jump (same as click/spacebar on desktop)
- Sound effects: jump, collision, power-up collect
- Monorepo structure with npm workspaces
- Railway deployment (single service serves API + static frontend)

## Capabilities

### New Capabilities
- `game-engine`: Core dino runner game loop with Kaplay — physics, collisions, spawning, difficulty curve
- `auth-login`: Google OAuth authentication via popup with JWT session management
- `score-tracking`: Score submission, per-user per-week deduplication (best score only), and personal history
- `ranking-leaderboard`: Top 25 rankings — global all-time, current ISO week, historical weeks
- `powerups`: Shield (absorbs one hit) and slow-mo (3s time dilation) pickups
- `user-interface`: React UI pages — game view (canvas + overlay), ranking table, user profile
- `monorepo-infrastructure`: npm workspaces setup, shared TypeScript configs, concurrent dev scripts, Railway deploy config

### Modified Capabilities

None — this is a greenfield project.

## Impact

New repository with two packages:
- `packages/client/` — Vite + React + Kaplay frontend
- `packages/server/` — Express + Prisma backend

Dependencies added: Kaplay (MIT), Prisma (Apache 2.0), Express (MIT), google-auth-library (Apache 2.0), jsonwebtoken (MIT), Vite (MIT), React (MIT).

Deployment: Railway single-service with SQLite volume persistence.
