# QA Agent Memory - Random Lunch Teammate

## Project Overview
- **Framework**: Next.js 16.1.6 (App Router) with React 19, Tailwind CSS 4, shadcn/ui 4
- **UI Library**: shadcn/ui (base-ui/react), lucide-react icons
- **DB Stack**: Drizzle ORM + Supabase (PostgreSQL via `postgres` driver) -- currently mock data only
- **Language**: Korean (lang="ko")

## Architecture
- SSR pages: dashboard (`/`), group detail (`/groups/[id]`), restaurants (`/restaurants`)
- Client components: sidebar, group-detail (stateful), participant-form, participant-list, participant-item, dialogs
- Sidebar uses shadcn SidebarProvider with mobile sheet pattern (auto-hides on mobile)
- Layout: `SidebarLayout` wraps all pages via root `layout.tsx`

## Key File Paths
- Types: `src/types/index.ts`
- Constants: `src/constants/teams.ts` (8 teams)
- Mock data: `src/mocks/groups.ts` (3 groups)
- Global styles: `src/app/globals.css` (Tailwind + shadcn theme tokens)
- DB schema: `src/db/schema.ts`, DB client: `src/db/index.ts`
- Server actions: `src/actions/match.ts`

## Known Issues (2026-03-10)
- participantCount on GroupCard is static (from mock data), does not update after registration
- Delete button on participant-item uses CSS opacity-0/group-hover:opacity-100 -- not keyboard accessible (no aria-label, no focus visibility)
- No per-page meta tags or structured data beyond root layout metadata
- No form validation beyond empty check (no duplicate name detection)
- Restaurants page is a placeholder ("준비 중입니다")
