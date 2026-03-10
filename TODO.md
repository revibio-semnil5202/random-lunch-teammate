# TODO

## Phase 1 - 기본 UI + Mock 데이터

- [x] shadcn/ui 셋업 + sky/blue 테마
- [x] Pretendard Variable 폰트 적용
- [x] 타입 정의 (Participant, MatchGroup, Group)
- [x] 상수 정의 (TEAMS - 프리셋 + 직접 입력 지원)
- [x] Mock 데이터 생성 (리비바이오&알렌의서재, 링커리어)
- [x] 사이드바 레이아웃 (로고 아이콘+링크, pill 메뉴, 반응형, 모바일 자동 닫기)
- [x] 대시보드 페이지 (그라데이션 카드 + 컬러바 디자인)
- [x] 그룹 상세 페이지 (카드 섹션 분리, 뒤로가기)
- [x] 참여자 등록 폼 (flex-wrap pill + 직접 입력, CTA 버튼, max-w 800px)
- [x] 등록/삭제 확인 모달 ({팀}/{이름} 볼드 + 개행) + loading 처리
- [x] 참여자 목록 (팀별 균등 grid, 뱃지 스타일)
- [x] 참여자 삭제 (bg-rose-400 X 버튼, hover/focus 노출)
- [x] 회사 근처 식당 페이지
- [x] 문서 생성 (db.md, api.md, ui-spec.md)
- [x] word-break: keep-all 글로벌 + Dialog 적용

## Phase 1.5 - 매칭 결과

- [x] Group 타입에 status, matchDeadline, matchResult, slackChannelUrl 추가
- [x] 그룹 카드 상태 표시 (모집중/결과보기 뱃지)
- [x] 매칭 리빌 연출 (3.5초 heartbeat + 텍스트 셔플 + 프로그레스 + 콘페티)
- [x] 리빌 1회성: 쿠키 기반 (12시간), 서버 cookies()로 hydration 안전 처리
- [x] 매칭 결과 페이지 (emerald 톤, 조 카드)
- [x] 슬랙 바로가기 버튼 (Slack 브랜드 컬러, 헤더 우측)
- [x] 랜덤 매칭 알고리즘 (`src/lib/match.ts`)
- [x] GitHub Actions cron (매칭 + keep-alive)
- [x] Cron API Route (`/api/cron/match`)

## Phase 1.7 - 과거 기록

- [x] 대시보드 하단 과거 기록 테이블
- [x] row 클릭 → 상세 페이지 (리빌 없이 결과 바로 노출)

## Phase 1.8 - 어드민 (그룹 관리)

- [x] GroupConfig 타입 (schedule 요일 로테이션, maxParticipants)
- [x] 어드민 그룹 관리 페이지 (`/admin/groups`)
- [x] 그룹 추가/수정 폼: 이름, 요일 로테이션, 최대인원, 마감시각
- [x] 슬랙 채널 바로가기 / 슬랙 알림 Webhook 필드 분리
- [x] 그룹 삭제 확인 다이얼로그
- [x] 사이드바 "그룹 관리" 메뉴 (FolderCog)

## Phase 2 - Supabase 연동 ✅

- [x] SQL 마이그레이션 실행 (members, group_configs, lunch_events, event_participants, match_results)
- [x] RLS 정책 (anon 읽기+참여등록, authenticated 전체 권한)
- [x] Drizzle 스키마 업데이트 (`src/db/schema.ts`)
- [x] DB 연결 (Session Pooler, prepare: false, ssl: require)
- [x] Server Actions 구현
  - [x] getGroups, getGroupDetail
  - [x] registerParticipant, deleteParticipant
  - [x] getGroupConfigs, createGroupConfig, updateGroupConfig, deleteGroupConfig
  - [x] createRandomMatch (매칭 + match_results 저장)
- [x] 페이지 mock → 실데이터 연동
- [x] Cron API Route DB 연동
- [x] 컴포넌트 Server Action 연동 + 에러 처리
- [x] Vercel 배포 + 환경변수 설정

## Phase 2.5 - 슬랙 알림

- [x] 슬랙 알림 모듈 (`src/lib/slack.ts`, APP_URL 환경변수)
- [x] 주간 참여 안내 (`/api/cron/slack-notify?type=weekly`)
- [x] 마감 전 리마인더 (`/api/cron/slack-notify?type=reminder`)
- [x] 매칭 결과 자동 발송 (매칭 완료 시)
- [ ] GitHub Actions cron 추가 (월요일 10시 weekly, 마감 1시간 전 reminder)

## Phase 2.7 - 과거 기록 관리

- [x] 과거 기록 최대 10개 표시 (limit 10)
- [x] 매칭 완료 후 10개 초과 시 자동 삭제

## 임시 변경 (되돌리기 필요)

- [ ] match-cron.yml: 24시간 → KST 09:00~18:00으로 복원 (`*/5 0-9 * * 1-5`)
- [ ] TimePicker: 분 선택 제거, 정시(HH:00)만 선택 가능하도록 복원

## Phase 3 - 인증 + 안정화 ✅

- [x] Supabase 이메일 로그인 (`@supabase/ssr`, 미들웨어 라우팅 보호)
- [x] 역할 기반 접근 제어 (일반/관리자, `app_metadata.role`)
- [x] 로그인 페이지 UI + 사이드바 조건부 메뉴 + 로그아웃
- [x] 어드민 서버 액션 `requireAdmin()` 가드
- [x] 쿠키 만료일 30일 설정
- [x] lunch_events 자동 생성 (그룹 추가/수정 시 `ensureThisWeekEvent`)
- [x] KST 타임존 고정 (Vercel UTC 서버 대응)
- [x] 그룹 카드/상세 마감일 표시 (`matchDeadlineDisplay`)
- [x] DB 연결 풀 개선 (max:1 + globalThis 싱글톤)
- [x] 글로벌 에러 바운더리 (toast + /login 리다이렉트)
- [x] 에러 핸들링 고도화 (Sonner toast 알림)
- [x] 인증 설정 가이드 (`docs/auth-setup.md`)

## Phase 4 - 남은 작업

- [ ] GitHub Actions cron 추가 (월요일 10시 weekly, 마감 1시간 전 reminder)
- [ ] 과거 기록 검색/필터
- [ ] Zod 입력값 검증
