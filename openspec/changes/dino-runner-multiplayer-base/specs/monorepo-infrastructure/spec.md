## ADDED Requirements

### Requirement: npm workspaces monorepo
The repository SHALL use npm workspaces with two packages: client and server.

#### Scenario: Install dependencies
- **WHEN** user runs npm install at root
- **THEN** dependencies for both packages are installed
- **THEN** both packages are hoisted appropriately

#### Scenario: Dev script
- **WHEN** user runs npm run dev at root
- **THEN** both client (Vite dev server) and server (ts-node/nodemon) start concurrently

### Requirement: Shared TypeScript configuration
The repository SHALL have a root tsconfig.base.json that both packages extend.

#### Scenario: Type checking
- **WHEN** TypeScript checks either package
- **THEN** both use the shared base config
- **THEN** package-specific overrides are applied per-package

### Requirement: Production build
The root SHALL have a build script that compiles the client (Vite build) and server (tsc).

#### Scenario: Build
- **WHEN** user runs npm run build at root
- **THEN** client is built to packages/client/dist/
- **THEN** server is compiled to packages/server/dist/

### Requirement: Railway deployment
The repository SHALL contain a railway.json and/or Nixpacks config for single-service deployment.

#### Scenario: Deploy to Railway
- **WHEN** Railway builds the project
- **THEN** server is started with node dist/index.js
- **THEN** server serves client/dist/ as static files in production
- **THEN** Prisma migrations run on startup
