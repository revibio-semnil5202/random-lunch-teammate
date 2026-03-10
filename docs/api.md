# API 명세 (Server Actions)

사내 서비스이므로 REST API Routes 대신 **Server Actions** 채택.
현재 Phase 1은 목(mock) 데이터 사용. Phase 2에서 Supabase 연동 예정.

## Actions

### getGroups
- **파일**: `src/actions/groups.ts` (예정)
- **설명**: 대시보드용 그룹 목록 조회 (진행중 + 과거 기록)
- **반환**: `{ active: Group[], past: Group[] }`
- **현재**: `src/mocks/groups.ts`에서 `mockGroups`, `mockPastGroups` 직접 import

### getGroupDetail
- **파일**: `src/actions/groups.ts` (예정)
- **설명**: 그룹 상세 정보 + 참여자 목록 조회 (진행중 + 과거 모두 검색)
- **파라미터**: `groupId: string`
- **반환**: `Group | null`
- **현재**: mockGroups + mockPastGroups에서 find

### registerParticipant
- **파일**: `src/actions/participants.ts` (예정)
- **설명**: 그룹에 참여자 등록
- **파라미터**:
  ```typescript
  {
    groupId: string;
    team: string;   // TEAMS 프리셋 또는 직접 입력 문자열
    name: string;   // 최대 10글자
  }
  ```
- **반환**: `Participant`
- **검증**: name 길이, 그룹 상태가 "recruiting"인지, 동일 team+name 중복 확인
- **현재**: 클라이언트 state에서 mock 처리 (800ms delay)

### deleteParticipant
- **파일**: `src/actions/participants.ts` (예정)
- **설명**: 그룹에서 참여자 삭제
- **파라미터**:
  ```typescript
  {
    groupId: string;
    participantId: string;
  }
  ```
- **반환**: `{ success: boolean }`
- **현재**: 클라이언트 state에서 mock 처리 (800ms delay)

### createRandomMatch
- **파일**: `src/actions/match.ts`
- **설명**: 전체 멤버를 랜덤으로 섞어 그룹으로 나누고 DB에 저장
- **파라미터**: `maxGroupSize: number` (기본값: 4, 최대: 12)
- **로직**: `src/lib/match.ts`의 순수 함수 `createMatch` 사용
  - 3명 미만: 매칭 불가
  - 3~5명: 한 그룹 (셔플 안 함)
  - 6명 이상: Fisher-Yates 셔플 → 균등 분배
    - `numGroups = ceil(total / maxSize)`
    - `baseSize = floor(total / numGroups)`, `extra = total % numGroups`
    - extra개 그룹은 (baseSize + 1)명, 나머지는 baseSize명
- **반환**: `{ success: boolean; groups?: { groupId, members }[]; message?: string }`
- **현재**: DB 저장 로직 포함, Phase 2에서 lunch event 단위로 확장 예정

## API Routes

### POST /api/cron/match
- **파일**: `src/app/api/cron/match/route.ts`
- **설명**: GitHub Actions cron에서 호출하는 자동 매칭 엔드포인트
- **인증**: `Authorization: Bearer {CRON_SECRET}` 헤더 필수
- **스케줄**: 평일 11:30 KST (GitHub Actions cron)
- **현재**: `createRandomMatch()` 직접 호출
- **Phase 2**: DB에서 matchDeadline이 지난 recruiting 그룹을 조회하여 개별 매칭 실행

## GitHub Actions

### match-cron.yml
- **스케줄**: `30 2 * * 1-5` (평일 11:30 KST = UTC 02:30)
- **동작**: `APP_URL/api/cron/match`에 POST 요청
- **필요 Secrets**: `APP_URL`, `CRON_SECRET`
- `workflow_dispatch`로 수동 실행 가능

### keep-alive.yml
- **스케줄**: `0 0 1,21 * *` (매월 1일, 21일)
- **동작**: `gautamkrishnar/keepalive-workflow`로 더미 커밋 생성
- **목적**: GitHub Actions 60일 비활성화 자동 중지 방지

## Phase 2 연동 계획

1. Drizzle ORM 쿼리로 Server Actions 구현
2. Zod로 입력값 검증
3. revalidatePath로 캐시 무효화
4. 에러 핸들링 표준화
5. Cron API Route에서 DB 기반 자동 매칭 (matchDeadline 조회 → 매칭 실행 → status 업데이트)
6. groups 테이블에 `max_group_size` 컬럼 추가하여 그룹별 최대 인원 설정
