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

### groups 테이블 확장
- `name` varchar(100) NOT NULL 추가 — 그룹 타이틀
- `lunch_date` date NOT NULL 추가 — 팀점 진행일
- `match_deadline` timestamp NOT NULL 추가 — 매칭 마감 시각 (ex: 11:00)
- `status` varchar(20) NOT NULL default 'recruiting' — 그룹 상태 ("recruiting" | "matched")
- `max_group_size` integer NOT NULL default 4 — 매칭 시 최대 그룹 인원 (3~12)
- `slack_channel_url` varchar(500) nullable — 슬랙 채널 바로가기 URL

### members 테이블 변경
- `department` NOT NULL로 변경 — 소속 팀 필수값 (프리셋 또는 직접 입력 문자열)
- `name` length 50 → 10 축소

### group_members 테이블 변경
- UNIQUE constraint (group_id, member_id) 추가 — 중복 참여 방지
- `created_at` timestamp 컬럼 추가
- FK에 ON DELETE CASCADE 추가

### match_results 테이블 (신규)
- `id` serial PK
- `group_id` integer NOT NULL, FK → groups.id
- `match_group_index` integer NOT NULL — 몇 번째 조인지 (1, 2, 3...)
- `member_id` integer NOT NULL, FK → members.id
- `created_at` timestamp default NOW

## 참여자 데이터 구조

```typescript
interface Participant {
  id: string;
  team: string;    // 소속 팀 (프리셋 or 직접 입력)
  name: string;    // 이름
  createdAt: string;
}
```

## 매칭 결과 데이터 구조

```typescript
interface MatchGroup {
  groupIndex: number;    // 조 번호 (1, 2, 3...)
  members: Participant[];
}
```

## 그룹 데이터 구조

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
