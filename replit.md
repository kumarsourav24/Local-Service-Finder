# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, TailwindCSS, React Query, Framer Motion, Recharts

## Project: LocalPro - Local Services Platform

A location-based marketplace connecting users with nearby skilled workers (electricians, plumbers, mechanics, tutors, carpenters, etc.).

### Features
- Worker registration & profiles
- Skill-based search with location-based ordering
- Booking system (date/time, address, payment method)
- Ratings & reviews
- Worker dashboard with earnings and job stats
- Emergency services mode

### Pages
- `/` — Home with hero, categories, featured workers
- `/search` — Search results with filters by category, emergency mode
- `/workers/:id` — Worker profile with reviews, booking button
- `/booking/:workerId` — Booking form
- `/dashboard` — Worker dashboard (use `?workerId=X`)
- `/register` — Worker registration
- `/emergency` — Emergency services

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── local-pro/          # React + Vite frontend (at /)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   └── src/seed.ts         # Database seeder
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package
```

## Database Schema

- `categories` — service categories
- `workers` — worker profiles
- `bookings` — service bookings
- `reviews` — worker reviews

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- `pnpm run build` — runs `typecheck` first, then recursively runs `build`

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/`:
- `health.ts` — GET /healthz
- `categories.ts` — GET /categories
- `workers.ts` — GET/POST /workers, GET /workers/:id, GET /workers/:id/availability, GET /workers/:id/dashboard
- `bookings.ts` — GET/POST /bookings, GET/PATCH /bookings/:id
- `reviews.ts` — GET/POST /reviews

### `artifacts/local-pro` (`@workspace/local-pro`)

React + Vite frontend at preview path `/`.

### `lib/db` (`@workspace/db`)

- `push`: `pnpm --filter @workspace/db run push`

### Seed Data

Run `pnpm --filter @workspace/scripts run seed` to populate sample workers.
