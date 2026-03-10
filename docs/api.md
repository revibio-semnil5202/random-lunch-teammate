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
- **검증**: team 유효성, name 길이
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

## Phase 2 연동 계획

1. Drizzle ORM 쿼리로 Server Actions 구현
2. Zod로 입력값 검증
3. revalidatePath로 캐시 무효화
4. 에러 핸들링 표준화
