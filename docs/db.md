# DB 스키마 명세

## 현재 스키마 (Drizzle ORM)

파일: `src/db/schema.ts`

### members
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | serial | PK | 참여자 고유 ID |
| name | varchar(50) | NOT NULL | 이름 |
| department | varchar(50) | nullable | 소속 팀 |
| created_at | timestamp | NOT NULL, default NOW | 생성일 |

### groups
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | serial | PK | 그룹 고유 ID |
| matched_at | date | NOT NULL, default NOW | 매칭일 |

### group_members
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | serial | PK | 관계 고유 ID |
| group_id | integer | NOT NULL, FK → groups.id | 소속 그룹 |
| member_id | integer | NOT NULL, FK → members.id | 참여자 |

## 진화 계획 (Phase 2)

### group_configs 테이블 (신규) — 어드민 그룹 템플릿

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | serial | PK | 그룹 설정 고유 ID |
| title | varchar(100) | NOT NULL | 그룹 이름 |
| schedule | jsonb | NOT NULL | 요일 로테이션 배열 (ex: `["수","목"]`) |
| max_participants | integer | NOT NULL, default 12 | 최대 참여 인원 (최소 3) |
| match_deadline_time | varchar(5) | NOT NULL, default '11:00' | 매칭 마감 시각 (HH:MM) |
| slack_channel_url | varchar(500) | nullable | 슬랙 채널 바로가기 URL |
| slack_webhook_url | varchar(500) | nullable | 슬랙 Incoming Webhook URL (알림 발송용) |
| created_at | timestamp | NOT NULL, default NOW | 생성일 |

**요일 로테이션 (schedule)**:
- `["수"]` → 매주 수요일
- `["수", "목"]` → 1주차 수, 2주차 목, 3주차 수, 4주차 목... 반복
- `["화", "목", "금"]` → 3주 사이클로 화→목→금 반복
- 시작일 기준으로 현재 주차를 계산하여 해당 요일에 이벤트 생성

### lunch_events 테이블 (신규) — 각 회차 이벤트 (기존 groups 역할 확장)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | serial | PK | 이벤트 고유 ID |
| group_config_id | integer | NOT NULL, FK → group_configs.id | 소속 그룹 설정 |
| lunch_date | date | NOT NULL | 팀점 진행일 |
| match_deadline | timestamp | NOT NULL | 매칭 마감 시각 |
| status | varchar(20) | NOT NULL, default 'recruiting' | "recruiting" \| "matched" |
| created_at | timestamp | NOT NULL, default NOW | 생성일 |

### members 테이블 변경
- `department` NOT NULL로 변경 — 소속 팀 필수값 (프리셋 또는 직접 입력 문자열)
- `name` length 50 → 10 축소

### group_members → event_participants (리네이밍)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | serial | PK | 관계 고유 ID |
| event_id | integer | NOT NULL, FK → lunch_events.id | 소속 이벤트 |
| member_id | integer | NOT NULL, FK → members.id | 참여자 |
| created_at | timestamp | NOT NULL, default NOW | 참여 등록일 |

- UNIQUE constraint (event_id, member_id) — 중복 참여 방지
- FK에 ON DELETE CASCADE 추가

### match_results 테이블 (신규)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | serial | PK | |
| event_id | integer | NOT NULL, FK → lunch_events.id | 소속 이벤트 |
| match_group_index | integer | NOT NULL | 조 번호 (1, 2, 3...) |
| member_id | integer | NOT NULL, FK → members.id | 참여자 |
| created_at | timestamp | NOT NULL, default NOW | |

## 데이터 구조 (TypeScript)

### GroupConfig — 어드민 그룹 템플릿

```typescript
interface GroupConfig {
  id: string;
  title: string;
  schedule: DayOfWeek[];  // 요일 로테이션 ["수","목"] = 수→목 반복
  maxParticipants: number;
  matchDeadlineTime: string; // "11:00"
  slackChannelUrl?: string;
  createdAt: string;
}
```

### Group — 각 회차 이벤트 (lunch_events 기반)

```typescript
interface Group {
  id: string;
  title: string;
  lunchDate: string;
  lunchDateDisplay: string;
  participantCount: number;
  participants: Participant[];
  status: "recruiting" | "matched";
  matchDeadline: string;
  matchResult?: MatchGroup[];
  slackChannelUrl?: string;
}
```

### Participant

```typescript
interface Participant {
  id: string;
  team: string;    // 소속 팀 (프리셋 or 직접 입력)
  name: string;    // 이름 (최대 10글자)
  createdAt: string;
}
```

### MatchGroup

```typescript
interface MatchGroup {
  groupIndex: number;    // 조 번호 (1, 2, 3...)
  members: Participant[];
}
```

## 소속 팀 관리

TypeScript 상수 배열 (`src/constants/teams.ts`) + 직접 입력 지원:

```typescript
export const TEAMS = [
  "기획", "마케팅", "광고", "출판",
  "백엔드", "프론트", "iOS", "Android", "플러터",
  "디자인", "인사", "총무", "QA",
] as const;
```

DB에는 string으로 저장 (프리셋/커스텀 구분 없음).

## 관계 다이어그램

```
group_configs (어드민 설정)
  │
  ├── 1:N ── lunch_events (각 회차)
  │             │
  │             ├── 1:N ── event_participants (참여자)
  │             │             └── N:1 ── members
  │             │
  │             └── 1:N ── match_results (매칭 결과)
  │                           └── N:1 ── members
```
