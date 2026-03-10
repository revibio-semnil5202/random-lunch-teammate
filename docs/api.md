# API 명세 (Server Actions)

사내 서비스이므로 REST API Routes 대신 **Server Actions** 채택.
현재 Phase 1은 목(mock) 데이터 사용. Phase 2에서 Supabase 연동 예정.

## Actions

### getGroups
- **파일**: `src/actions/groups.ts` (예정)
- **설명**: 대시보드용 그룹 목록 조회
- **반환**: `Group[]`
- **현재**: `src/mocks/groups.ts`에서 직접 import

### getGroupDetail
- **파일**: `src/actions/groups.ts` (예정)
- **설명**: 그룹 상세 정보 + 참여자 목록 조회
- **파라미터**: `groupId: string`
- **반환**: `Group | null`
- **현재**: mockGroups에서 find

### registerParticipant
- **파일**: `src/actions/participants.ts` (예정)
- **설명**: 그룹에 참여자 등록
- **파라미터**:
  ```typescript
  {
    groupId: string;
    team: string;   // TEAMS 상수 중 하나
    name: string;   // 최대 10글자
  }
  ```
- **반환**: `Participant`
- **검증**: team 유효성, name 길이, 그룹 상태가 "recruiting"인지 확인
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

### executeMatch (Phase 1.5)
- **파일**: `src/actions/match.ts`
- **설명**: 참여자를 랜덤으로 점심 조에 배정
- **파라미터**: `groupId: string`
- **로직**: Fisher-Yates 셔플 → groupSize(기본 4명) 단위로 분할
- **반환**: `MatchGroup[]` (각 조의 참여자 배열)
- **트리거**: matchDeadline 도달 시 (현재는 mock 데이터로 처리)
- **현재**: 기존 `src/actions/match.ts`의 `createRandomMatch` 함수 재활용

## Phase 2 연동 계획

1. Drizzle ORM 쿼리로 Server Actions 구현
2. Zod로 입력값 검증
3. revalidatePath로 캐시 무효화
4. 에러 핸들링 표준화
5. matchDeadline 기반 자동 매칭 (cron or edge function)
