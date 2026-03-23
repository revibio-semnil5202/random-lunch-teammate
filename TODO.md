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
- [x] GitHub Actions cron (월요일 10시 weekly, 마감 1시간 전 reminder)

## Phase 2.7 - 과거 기록 관리

- [x] 과거 기록 최대 10개 표시 (limit 10)
- [x] 매칭 완료 후 10개 초과 시 자동 삭제

## 임시 변경 (되돌리기 필요)

- [x] ~~match-cron.yml: 24시간 → KST 08:00~12:30 30분 단위로 변경~~
- [x] ~~TimePicker: 30분 단위로 변경~~

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

## Phase 3.5 - 그룹 타입 분리

- [x] GroupConfig에 groupType 컬럼 추가 (company | team, default company)
- [x] 어드민 그룹 추가/수정 폼에 타입 선택 UI (생성 시만, 수정 시 disabled)
- [x] 팀 단위 참여자 폼: 소속 팀 선택 숨김, 이름만 입력
- [x] 팀 단위 참여자 목록: 팀 그룹핑 없이 플랫 리스트
- [x] 팀 단위 매칭 결과: 팀 뱃지 숨김
- [x] 확인/삭제 다이얼로그: 팀 단위면 이름만 표시
- [x] 어드민 그룹 카드에 "팀 단위" 뱃지 표시
- [x] 문서 업데이트 (db.md, ui-spec.md)

## Phase 4 - 남은 작업

- [x] GitHub Actions cron (월요일 10시 weekly, 마감 1시간 전 reminder)
- [x] cron-job.org 전환 완료 (GitHub Actions cron 지연 문제)
  - 매칭 + 마감 리마인더를 cron-job.org로 이관 (`*/30 8-12 * * 1-5`)
  - weekly 알림은 GitHub Actions 유지 (주 1회, 지연 허용)
- [x] 마감 리마인더 중복 발송 방지 (`reminder_sent_at` 플래그)
- [x] 슬랙 메시지에 `@here` 멘션 추가
- [x] 식당 카테고리 색상 20개 풀로 확장 + 새 카테고리 자동 할당

## 추후 작업

- [ ] 슬랙 주간 안내 메시지에 추가한 사용법 링크 제거 (`src/lib/slack.ts` sendWeeklyNotice)
