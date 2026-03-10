# UI/UX 스펙

## 디자인 시스템

- **UI 라이브러리**: shadcn/ui (base-ui 기반, `asChild` 미지원 → `render` prop 사용)
- **스타일링**: Tailwind CSS v4
- **아이콘**: lucide-react
- **Primary 색상**: sky 계열 `oklch(0.637 0.196 262.881)`
- **폰트**: Pretendard Variable (CDN)
- **디자인 언어**: 그라데이션 카드 + 좌측 컬러바 + 원형 아이콘 뱃지
- **글로벌**: `word-break: keep-all` (body + Dialog)

## 라우트 구조

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 대시보드 | 진행중 그룹 카드 + 과거 기록 테이블 |
| `/groups/[id]` | 그룹 상세 | 모집중: 참여자 등록/삭제, 매칭완료: 리빌 연출 + 결과 표시 |
| `/restaurants` | 식당 목록 | placeholder |

## 레이아웃

### 사이드바 (`src/components/app-sidebar.tsx`)
- **로고**: primary 배경 아이콘(Utensils) + "랜덤 점심 / 팀메이트" 2단 텍스트, `/` 링크
- **구분선**: SidebarSeparator로 로고/메뉴 영역 분리
- **메뉴**: h-10 pill, 아이콘 18px, rounded-lg, text-base (16px)
  - 대시보드 (LayoutDashboard)
  - 회사 근처 식당 (UtensilsCrossed)
- **활성 상태**: sidebar-accent 배경 (sky 톤 `oklch(0.93 0.02 260)`)
- `/groups/*` 경로에서 "대시보드" 활성
- 모바일: 메뉴 클릭 시 자동 닫기

### 헤더 (`src/components/sidebar-layout.tsx`)
- **모바일에서만 표시** (`md:hidden`)
- SidebarTrigger + 구분선 + 앱 타이틀

## 페이지별 스펙

### 대시보드 (`/`)

#### 진행중 그룹 카드
- 컴포넌트: `GroupCard` (`src/components/group-card.tsx`)
- 레이아웃: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **카드 디자인**:
  - 좌측 컬러바 (모집중: bg-primary, 매칭완료: bg-amber-500)
  - 그라데이션 배경
  - 참여인원/진행일: 원형 아이콘 뱃지 + 가로 배치
  - 우측 ChevronRight, hover 시 -translate-y-0.5 + shadow-lg
- **그룹 상태 표시**:
  - 모집중: "모집중" 뱃지 (Clock 아이콘, primary 색상)
  - 매칭완료: "결과보기" 뱃지 (Trophy 아이콘, amber 색상)

#### 과거 기록 테이블
- 컴포넌트: `PastMatchTable` (`src/components/past-match-table.tsx`)
- Trophy 아이콘 + "지난 팀점 기록" 제목
- `rounded-xl border` 테이블, 칼럼: 그룹 이름 / 진행일
- 각 row 클릭 → `/groups/[id]` 상세 페이지 이동 (결과 바로 노출)
- hover 시 bg-accent + ChevronRight 이동 효과

### 그룹 상세 - 모집중 (`/groups/[id]`)
- 오케스트레이터: `GroupDetail` (`src/components/group-detail.tsx`)
- **헤더**: 뒤로가기(대시보드) + 그라데이션 카드 (참여인원/진행일)
- **등록 폼**: `rounded-2xl border bg-card p-6` 카드 섹션
  - 소속 팀: `flex flex-wrap gap-2`, pill 버튼 (13개 프리셋 + 직접 입력)
  - 직접 입력: 점선 border + 연필 아이콘 → 클릭 시 인라인 input + 확인/취소
  - 이름: Input `text-base h-10 max-w-sm`
  - CTA 버튼: `h-12 max-w-sm`, UserPlus 아이콘, shadow
  - max-width 800px, 가운데 정렬
- **참여자 목록**: `rounded-2xl border bg-card p-6` 카드 섹션
  - 팀별 균등 grid (`grid-cols-2 md:3 lg:4 xl:5`)
  - 팀 헤더: border-b 구분선 + bold
  - 아이템: 팀명 뱃지(bg-primary/10) + 이름, hover 시 X 삭제 버튼 (bg-rose-400)
- **확인/삭제 모달**: `{팀}/{이름}` 볼드 + 개행 + 질문 텍스트

### 그룹 상세 - 매칭완료 (`/groups/[id]`)

#### 매칭 리빌 연출 (`src/components/match-reveal.tsx`)
- **첫 방문** (쿠키 `match-revealed-{id}` 없을 때):
  - 3.5초 동안 heartbeat 펄스 애니메이션 + 텍스트 셔플 + 프로그레스 바
  - 참여자 이름 미리보기 (pulse 효과)
  - 완료 후 콘페티 3회 발사 (양측 하단, canvas-confetti, amber+blue+pink)
  - 결과 페이지 fade-in + slide-in-from-bottom
  - `document.cookie`에 12시간 쿠키 설정
- **재방문** (쿠키 있을 때):
  - 서버에서 `cookies()` 로 확인 → `alreadySeen` prop → 바로 결과 렌더 (hydration 안전)

#### 매칭 결과 (`src/components/match-result.tsx`)
- **헤더**: 뒤로가기 + 그라데이션 카드 (amber 톤)
  - 매칭 완료 뱃지: 모바일 → 타이틀 위, PC → 타이틀 오른쪽
  - 참여인원 / 진행일 / 조 수 stats
  - 슬랙 바로가기 버튼: Slack 브랜드 컬러 (`#4A154B`), 로고 SVG, ExternalLink 아이콘
    - `slackChannelUrl` 있을 때만 렌더, `target="_blank"`
- **매칭 결과 조 카드**: `grid md:grid-cols-2`
  - 각 조: amber 넘버 원형 + 멤버 리스트 (팀명 뱃지 스타일)

## 색상 체계

| 상태 | 컬러바 | 뱃지 배경 | 텍스트 |
|------|--------|----------|--------|
| 모집중 | bg-primary | bg-primary/10 | text-primary |
| 매칭완료 | bg-amber-500 | bg-amber-100 | text-amber-700 |
| 삭제 버튼 | - | bg-rose-400 | text-white |

## 그룹 상태 흐름

```
모집중 (recruiting)
  ↓ matchDeadline 도달 (ex: 03.11 11:00)
매칭완료 (matched)
  → matchResult에 랜덤 조 배정 결과 저장
  → 첫 방문 시 리빌 연출 (3.5초) + 콘페티
  → 12시간 쿠키로 재방문 시 바로 결과 노출
```

## 반응형 Breakpoints

| 구분 | 너비 | 사이드바 | 카드 | 팀 선택 | 참여자 목록 |
|------|------|---------|------|---------|------------|
| 모바일 | < 768px | 숨김 (햄버거) | 1열 | flex-wrap | 2열 |
| 태블릿 | 768-1024px | 접힘 가능 | 2열 | flex-wrap | 3열 |
| 데스크톱 | > 1024px | 펼침 | 3열 | flex-wrap | 4~5열 |
