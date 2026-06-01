# NEXUS OS

AI-native, multi-tenant command center SaaS for architecture, interior design,
production, and design-focused MNCs.

This implementation includes a Next.js App Router workspace, strict TypeScript,
Tailwind v3 design tokens, animated OS shell, command palette, project/people/assets/
finance/intelligence modules, client portal, super-admin route, Prisma schema,
RLS policy sketch, API contracts, and focused tests.

## Getting Started

Install dependencies and generate Prisma Client:

```bash
npm install
```

Create `.env.local` from `.env.example`, then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm run test
npm run prisma:validate
npm run build
```

## Key Routes

- `/` command center dashboard
- `/projects` project management workspace
- `/people` team directory and capacity planner
- `/assets` asset and knowledge management
- `/finance` financial command module
- `/intelligence` NEXUS Mind AI layer
- `/client-portal` white-labeled client portal
- `/settings` themes, fonts, density, preferences
- `/admin` platform super-admin control plane
