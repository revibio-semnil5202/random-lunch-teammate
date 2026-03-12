# API 명세 (Server Actions)

사내 서비스이므로 REST API Routes 대신 **Server Actions** 채택. Supabase(PostgreSQL) + Drizzle ORM 연동.

## 어드민 Actions (인증 필요)

### getGroupConfigs
- **파일**: `src/actions/admin.ts` (예정)
- **설명**: 어드민 그룹 설정 목록 조회
- **반환**: `GroupConfig[]`
- **현재**: `src/mocks/group-configs.ts`에서 직접 import

### createGroupConfig
- **파일**: `src/actions/admin.ts` (예정)
- **설명**: 그룹 설정 추가
- **파라미터**:
  ```typescript
  {
    title: string;
    schedule: DayOfWeek[];     // 요일 로테이션 (ex: ["수","목"])
    maxParticipants: number;   // 최소 3
    matchDeadlineTime: string; // "11:00"
    slackChannelUrl?: string;
    slackWebhookUrl?: string;
  }
  ```
- **반환**: `GroupConfig`
- **현재**: 클라이언트 state에서 mock 처리

### updateGroupConfig
- **파일**: `src/actions/admin.ts` (예정)
- **설명**: 그룹 설정 수정
- **파라미터**: `{ id: string } & Partial<Omit<GroupConfig, "id" | "createdAt">>`
- **반환**: `GroupConfig`
- **현재**: 클라이언트 state에서 mock 처리

### deleteGroupConfig
- **파일**: `src/actions/admin.ts` (예정)
- **설명**: 그룹 설정 삭제
- **파라미터**: `{ id: string }`
- **반환**: `{ success: boolean }`
- **현재**: 클라이언트 state에서 mock 처리

## 일반 Actions

### getGroups
- **파일**: `src/actions/groups.ts`
- **설명**: 대시보드용 이벤트 목록 조회 (진행중 + 과거 기록)
- **반환**: `{ active: Group[], past: Group[] }`
- **active**: 이번 주 (월~일) lunch_events
- **past**: 이번 주 이전 matched 이벤트, 최대 10개 (desc lunchDate)

### getGroupDetail
- **파일**: `src/actions/groups.ts` (예정)
- **설명**: 이벤트 상세 정보 + 참여자 목록 조회
- **파라미터**: `eventId: string`
- **반환**: `Group | null`
- **현재**: mockGroups + mockPastGroups에서 find

### registerParticipant
- **파일**: `src/actions/participants.ts` (예정)
- **설명**: 이벤트에 참여자 등록
- **파라미터**:
  ```typescript
  {
    eventId: string;
    team: string;   // TEAMS 프리셋 또는 직접 입력 문자열
    name: string;   // 최대 10글자
  }
  ```
- **반환**: `Participant`
- **검증**: name 길이, 이벤트 상태가 "recruiting"인지, 동일 team+name 중복 확인, maxParticipants 초과 확인
- **현재**: 클라이언트 state에서 mock 처리 (800ms delay)

### deleteParticipant
- **파일**: `src/actions/participants.ts` (예정)
- **설명**: 이벤트에서 참여자 삭제
- **파라미터**:
  ```typescript
  {
    eventId: string;
    participantId: string;
  }
  ```
- **반환**: `{ success: boolean }`
- **현재**: 클라이언트 state에서 mock 처리 (800ms delay)

### createRandomMatch
- **파일**: `src/actions/match.ts`
- **설명**: 이벤트의 참여자를 랜덤으로 섞어 그룹으로 나누고 DB에 저장
- **파라미터**: `eventId: string`
- **로직**: `src/lib/match.ts`의 순수 함수 `createMatch` 사용
  - 3명 미만: 매칭 불가
  - 3~5명: 한 그룹 (셔플 안 함)
  - 6명 이상: Fisher-Yates 셔플 → 균등 분배
- **반환**: `{ success: boolean; groups?: { groupIndex, memberIds }[]; message?: string }`
- **후처리**:
  - lunchEvents status → "matched" 업데이트
  - revalidatePath("/", "/groups/{eventId}")
  - 슬랙 매칭 결과 알림 (slackWebhookUrl 있을 때)
  - `cleanupOldEvents()`: matched 이벤트 10개 초과 시 오래된 것 자동 삭제
    - 삭제 순서: matchResults → eventParticipants → lunchEvents

## API Routes

### POST /api/cron/match
- **파일**: `src/app/api/cron/match/route.ts`
- **설명**: cron-job.org에서 호출하는 자동 매칭 엔드포인트
- **인증**: `Authorization: Bearer {CRON_SECRET}` 헤더 필수
- **로직**:
  1. 매칭 마감인 lunch_events 조회 (status = 'recruiting', match_deadline ≤ now)
  2. 각 이벤트에 대해 createRandomMatch 실행
  3. status → 'matched' 업데이트

### POST /api/cron/slack-notify
- **파일**: `src/app/api/cron/slack-notify/route.ts`
- **설명**: 슬랙 Incoming Webhook을 통한 자동 알림 발송
- **인증**: `Authorization: Bearer {CRON_SECRET}` 헤더 필수
- **알림 종류**:

#### 1. 주간 참여 안내 (매주 월요일 10:00 KST)
- **대상**: `slack_webhook_url`이 설정된 모든 group_configs
- **메시지**:
  > @here 🍽️ **[{그룹명}] 금주 팀점 참여자를 모집합니다!**
  >
  > 금주는 **{요일} ({날짜})** 에 팀점이 진행됩니다.
  > 참여를 원하시는 분께서는 아래 링크를 통해 참여해 주세요.
  >
  > 👉 참여하기

#### 2. 마감 1시간 전 리마인더 (매칭 당일, match_deadline - 1시간)
- **대상**: 마감 0~60분 전인 모집 중 lunch_events (status = 'recruiting', reminder_sent_at IS NULL)
- **중복 방지**: 발송 성공 후 `reminder_sent_at`에 타임스탬프 기록, 이후 cron에서 스킵
- **메시지**:
  > @here ⏰ **[{그룹명}] 금일 팀점 매칭까지 1시간 남았어요!**
  >
  > **{마감시각}**에 매칭이 마감됩니다. 현재 **{N}명** 참여 중입니다.
  >
  > 혹시 개인 사정이 생기셨다면 참여자 명단에서 이름을 빼주세요.
  >
  > 👉 확인하기

#### 3. 매칭 결과 발표 (매칭 완료 직후)
- **대상**: 방금 매칭 완료된 lunch_events
- **메시지**:
  > @here 🎉 **[{그룹명}] 팀점 매칭 결과가 나왔습니다!**
  >
  > 총 **{N}명**이 **{M}개 조**로 매칭되었습니다.
  >
  > 누구와 함께 식사하는지 확인해보세요.
  >
  > 👉 결과 보기

- **로직**: `type` 쿼리 파라미터로 알림 종류 구분 (`weekly` | `reminder`)

## 외부 Cron (cron-job.org)

GitHub Actions cron 지연 문제로 cron-job.org로 전환.

### 자동 매칭
- **스케줄**: `*/30 8-12 * * 1-5` (평일 KST 08:00~12:30, 30분 간격)
- **URL**: `POST {APP_URL}/api/cron/match`
- **헤더**: `Authorization: Bearer {CRON_SECRET}`

### 마감 리마인더
- **스케줄**: `*/30 8-12 * * 1-5` (평일 KST 08:00~12:30, 30분 간격)
- **URL**: `POST {APP_URL}/api/cron/slack-notify?type=reminder`
- **헤더**: `Authorization: Bearer {CRON_SECRET}`
- **로직**: 마감 0~60분 전인 이벤트 중 `reminder_sent_at IS NULL`만 발송, 발송 후 플래그 기록

## GitHub Actions

### slack-notify-cron.yml
- **주간 참여 안내**: `0 1 * * 1` (월요일 10:00 KST = UTC 01:00)
  - `APP_URL/api/cron/slack-notify?type=weekly`
- **필요 Secrets**: `APP_URL`, `CRON_SECRET`
- `workflow_dispatch`로 수동 실행 가능

### keep-alive.yml
- **스케줄**: `0 0 1,21 * *` (매월 1일, 21일)
- **동작**: `gautamkrishnar/keepalive-workflow`로 더미 커밋 생성
- **목적**: GitHub Actions 60일 비활성화 자동 중지 방지

## 인증 (Phase 2)

### Supabase Auth
- **방식**: 이메일/패스워드 로그인 (어드민 전용)
- **보호 범위**: `/admin/*` 라우트 + 사이드바 "그룹 관리" 메뉴
- **미들웨어**: `src/middleware.ts`에서 세션 검증 → 미인증 시 리다이렉트
- **일반 사용자**: 인증 없이 대시보드/그룹 상세 접근 가능
