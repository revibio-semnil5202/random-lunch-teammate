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
- `name` varchar(100) NOT NULL 추가 — 그룹 타이틀 (e.g., "리비바이오&알렌의서재")
- `lunch_date` date NOT NULL 추가 — 팀점 진행일

### members 테이블 변경
- `department` NOT NULL로 변경 — 소속 팀 필수값
- `name` length 50 → 10 축소

### group_members 테이블 변경
- UNIQUE constraint (group_id, member_id) 추가 — 중복 참여 방지
- `created_at` timestamp 컬럼 추가
- FK에 ON DELETE CASCADE 추가

## 참여자 데이터 구조

`string[]` 대신 **구조화된 객체** 채택:

```typescript
interface Participant {
  id: string;
  team: string;    // 소속 팀
  name: string;    // 이름
  createdAt: string;
}
```

### 채택 이유
- 팀별 그룹핑 시 문자열 파싱 불필요
- 필드별 검증 가능 (데이터 무결성)
- id, createdAt 등 확장 용이

## 소속 팀 관리

DB ENUM 대신 TypeScript 상수 배열로 관리 (`src/constants/teams.ts`):

```typescript
export const TEAMS = ["기획팀", "마케팅팀", "광고팀", "출판팀", "개발팀", "인사팀", "총무팀", "QA팀"] as const;
```
