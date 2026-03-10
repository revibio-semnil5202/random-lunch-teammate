# TODO

## Phase 1 - 기본 UI + Mock 데이터

- [x] shadcn/ui 셋업 + sky/blue 테마
- [x] Pretendard Variable 폰트 적용
- [x] 타입 정의 (Participant, MatchGroup, Group)
- [x] 상수 정의 (TEAMS - 13개 프리셋, "팀" 접미사 제거 + 직접 입력 지원)
- [x] Mock 데이터 생성 (진행중 3개 + 과거 기록 3개)
- [x] 사이드바 레이아웃 (로고 아이콘+링크, pill 메뉴, 반응형, 모바일 자동 닫기)
- [x] 대시보드 페이지 (그라데이션 카드 + 컬러바 디자인)
- [x] 그룹 상세 페이지 (카드 섹션 분리, 뒤로가기)
- [x] 참여자 등록 폼 (flex-wrap pill + 직접 입력, CTA 버튼, max-w 800px)
- [x] 등록/삭제 확인 모달 ({팀}/{이름} 볼드 + 개행) + loading 처리
- [x] 참여자 목록 (팀별 균등 grid, 뱃지 스타일)
- [x] 참여자 삭제 (bg-rose-400 X 버튼, hover/focus 노출)
- [x] 회사 근처 식당 placeholder 페이지
- [x] 문서 생성 (db.md, api.md, ui-spec.md)
- [x] 모든 Button cursor-pointer 기본 적용
- [x] word-break: keep-all 글로벌 + Dialog 적용

## Phase 1.5 - 매칭 결과

- [x] Group 타입에 status, matchDeadline, matchResult, slackChannelUrl 추가
- [x] 그룹 카드 상태 표시 (모집중/결과보기 뱃지)
- [x] 매칭완료 그룹 카드 디자인 (amber 컬러바 + 뱃지)
- [x] 매칭 리빌 연출 (3.5초 heartbeat + 텍스트 셔플 + 프로그레스)
- [x] 콘페티 3회 발사 (canvas-confetti, 양측 하단)
- [x] 리빌 1회성: 쿠키 기반 (12시간), 서버 cookies()로 hydration 안전 처리
- [x] 매칭 결과 페이지 (amber 톤, 조 카드)
- [x] 매칭완료 뱃지 반응형 (모바일: 타이틀 위, PC: 타이틀 옆)
- [x] 슬랙 바로가기 버튼 (Slack 브랜드 컬러, 로고 SVG, 헤더 우측)
- [x] 매칭 결과 mock 데이터
- [x] /groups/[id] 페이지에서 status 분기
- [x] 랜덤 매칭 알고리즘 리팩토링 (`src/lib/match.ts` 순수 함수 분리)
- [x] GitHub Actions 자동 매칭 cron 설정 (평일 11:30 KST)
- [x] GitHub Actions keep-alive 워크플로우 (60일 비활성화 방지)
- [x] Cron용 API Route (`/api/cron/match`) + CRON_SECRET 인증

## Phase 1.7 - 과거 기록 + UI 개선

- [x] 과거 기록 mock 데이터 (mockPastGroups)
- [x] 대시보드 하단 과거 기록 테이블 (PastMatchTable: 그룹 이름 / 진행일)
- [x] 테이블 row 클릭 → 상세 페이지 (결과 바로 노출, 리빌 없음)

## Phase 1.8 - 어드민 (그룹 관리)

- [x] GroupConfig 타입 정의 (dayOfWeek, frequency, biweeklyWeek, maxParticipants 등)
- [x] 어드민 그룹 관리 페이지 (`/admin/groups`)
- [x] 그룹 추가/수정 폼 (GroupConfigForm): 이름, 요일, 격주, 최대인원, 마감시각, 슬랙URL
- [x] 그룹 삭제 확인 다이얼로그
- [x] 사이드바에 "그룹 관리" 메뉴 추가 (FolderCog 아이콘)
- [x] Mock 데이터 (mockGroupConfigs)
- [ ] Supabase 어드민 인증 (이메일/패스워드) → 인증 시에만 사이드바 + 페이지 노출
- [ ] Server Actions 연동 (CRUD)

## Phase 2 - Supabase 연동

- [ ] DB 스키마 진화 (groups 확장, slack_channel_url, match_results 테이블 추가)
- [ ] Drizzle 마이그레이션 생성 및 실행
- [ ] Server Actions 구현 (getGroups, getGroupDetail, registerParticipant, deleteParticipant)
- [ ] executeMatch 서버 액션 (기존 createRandomMatch 재활용)
- [ ] Cron API Route에서 DB 조회 연동 (matchDeadline이 지난 recruiting 그룹 자동 매칭)
- [ ] groups 테이블에 max_group_size 컬럼 추가 (그룹별 최대 인원 설정)
- [ ] Zod 입력값 검증
- [ ] revalidatePath 캐시 무효화
- [ ] 에러 핸들링 (toast 알림)

## Phase 2.5 - 슬랙 알림

- [x] 슬랙 알림 발송 모듈 (`src/lib/slack.ts`)
- [x] 주간 참여 안내 (매주 월요일 10시, `/api/cron/slack-notify?type=weekly`)
- [x] 마감 전 리마인더 (`/api/cron/slack-notify?type=reminder`)
- [x] 매칭 결과 자동 발송 (`createRandomMatch` 완료 시)
- [ ] TODO: SERVICE_URL을 실제 배포 URL로 교체 (`src/lib/slack.ts`)
- [ ] GitHub Actions cron 추가 (월요일 10시 weekly, 매칭 당일 마감 1시간 전 reminder)

## Phase 2.7 - 과거 기록 관리

- [x] 대시보드 과거 기록 최대 10개 표시 (쿼리 limit 10)
- [x] 매칭 완료 후 matched 이벤트 10개 초과 시 오래된 것 자동 삭제 (cleanupOldEvents)

## Phase 3 - 기능 확장

- [ ] 과거 기록 검색/필터
