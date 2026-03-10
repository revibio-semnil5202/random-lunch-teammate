# Project Memory: random-lunch-teammate

## Stack
- Next.js 16.1.6, React 19, TypeScript 5
- Supabase (PostgreSQL) — connection via `postgres` + drizzle-orm
- shadcn/ui based on **base-ui** (NOT Radix) — `asChild` is NOT supported
- DB client: `src/db/index.ts` exports `db` (drizzle instance)

## Schema (src/db/schema.ts)
5 tables: `members`, `groupConfigs`, `lunchEvents`, `eventParticipants`, `matchResults`
- `members.name` max 10 chars, `members.department` = team name
- `groupConfigs.schedule` is `jsonb` typed as `string[]` (DayOfWeek[])
- `lunchEvents.status`: "recruiting" | "matched"
- `eventParticipants` links `lunchEvents` → `members`
- `matchResults` stores per-member group assignment (`matchGroupIndex`)

## Server Actions (src/actions/)
- `groups.ts`: `getGroups()`, `getGroupDetail(eventId)`
- `participants.ts`: `registerParticipant()`, `deleteParticipant()`
- `admin.ts`: `getGroupConfigs()`, `createGroupConfig()`, `updateGroupConfig()`, `deleteGroupConfig()`
- `match.ts`: `createRandomMatch(eventId)` — calls slack.ts after matching

## Key Patterns
- DB `id` fields are `serial` (integer); TypeScript types use `string` — always convert with `.toString()`
- Korean day names array: `["일","월","화","수","목","금","토"]` indexed by `Date.getDay()`
- "Active" events = this week (Mon–Sun); "Past" = before Monday, status='matched'
- Week bounds: getDay()===0 → diffToMonday=-6, else diffToMonday=1-dayOfWeek
- `revalidatePath("/")` and `revalidatePath("/groups/${eventId}")` after mutations

## Component Notes
- `RegisterConfirmDialog` and `DeleteConfirmDialog` accept optional `error?: string | null` prop
- `GroupConfigForm` accepts optional `isSubmitting?: boolean` prop
- `GroupDetail` and `GroupManagement` use `useRouter().refresh()` after server action mutations
- `GroupManagement` uses `initialConfigs` from server but router.refresh() triggers page re-render with fresh data

## Slack Integration
- `src/lib/slack.ts`: `sendMatchResult(webhookUrl, groupTitle, groupCount, totalMembers, groupId)`
- Called from `createRandomMatch` after DB save, errors are caught and logged (non-fatal)
