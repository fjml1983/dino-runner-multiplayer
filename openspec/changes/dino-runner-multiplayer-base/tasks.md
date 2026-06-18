## 1. Monorepo Infrastructure

- [x] 1.1 Initialize root package.json with npm workspaces pointing to packages/*
- [x] 1.2 Create packages/client/ with Vite + React + TypeScript scaffold
- [x] 1.3 Create packages/server/ with Express + TypeScript scaffold
- [x] 1.4 Create root tsconfig.base.json extended by both packages
- [x] 1.5 Set up concurrently scripts: npm run dev at root starts both dev servers
- [ ] 1.6 Create railway.json / Nixpacks config for deployment

## 2. Backend: Database & Auth

- [x] 2.1 Write Prisma schema (User + Score models)
- [x] 2.2 Run initial migration and seed script
- [x] 2.3 Implement POST /api/auth/google (verify Google token, upsert user, return JWT)
- [x] 2.4 Implement JWT middleware for protected routes
- [x] 2.5 Implement GET /api/auth/me

## 3. Backend: Scores & Ranking

- [x] 3.1 Implement POST /api/scores with upsert logic (one entry per userId+weekId)
- [x] 3.2 Implement GET /api/scores/me (user's score history)
- [x] 3.3 Implement GET /api/ranking/current (top 25 current ISO week)
- [x] 3.4 Implement GET /api/ranking/week/:weekId (top 25 historical week)
- [x] 3.5 Implement GET /api/ranking/all (top 25 global all-time)
- [x] 3.6 Implement GET /api/ranking/weeks (list available weeks)
- [x] 3.7 Add ISO week utility functions (getCurrentWeekId, etc.)

## 4. Backend: Static serving

- [ ] 4.1 Configure Express to serve client/dist in production mode
- [ ] 4.2 Add Prisma migration step to startup script

## 5. Frontend: Auth & HTTP client

- [ ] 5.1 Set up axios instance with JWT interceptor
- [ ] 5.2 Create AuthContext and Google OAuth integration (popup)
- [ ] 5.3 Redirect fallback if popup blocked
- [ ] 5.4 Create LoginButton component

## 6. Frontend: Game engine with Kaplay

- [ ] 6.1 Initialize Kaplay on a dedicated canvas element
- [ ] 6.2 Load sprites (dino, cactus, pterodactyl, ground, power-ups)
- [ ] 6.3 Load sound effects (jump, collision, powerup)
- [ ] 6.4 Implement menu scene (start prompt)
- [ ] 6.5 Implement game scene with physics (gravity, jump, ground scrolling)
- [ ] 6.6 Implement obstacle spawning with pattern pools per phase
- [ ] 6.7 Implement collision detection (AABB)
- [ ] 6.8 Implement game-over scene with score display and restart
- [ ] 6.9 Implement progressive difficulty system (4 phases)

## 7. Frontend: Power-ups

- [ ] 7.1 Implement shield pickup: spawn, visual aura, absorb collision, 5s timer
- [ ] 7.2 Implement slow-mo pickup: spawn, speed reduction, purple tint, 3s timer
- [ ] 7.3 Implement power-up spawner with weighted probability (shield 70%, slow-mo 30%)

## 8. Frontend: React UI

- [ ] 8.1 Create GamePage with KaplayCanvas + ScoreDisplay overlay
- [ ] 8.2 Wire event bus (game:score → React, game:over → submit modal)
- [ ] 8.3 Create RankingPage with tabs (current week, historical, all-time)
- [ ] 8.4 Create ProfilePage with personal stats and score history
- [ ] 8.5 Implement responsive layout (mobile full-width canvas, desktop centered)
- [ ] 8.6 Touch input support for mobile (jump on tap)

## 9. Polish & Deploy

- [ ] 9.1 Add CC0 sprites to public/sprites/
- [ ] 9.2 Add sound files to public/sounds/
- [ ] 9.3 Test full flow: login → play → submit → view ranking
- [ ] 9.4 Deploy to Railway
- [ ] 9.5 Verify production build serves everything via single Express service
