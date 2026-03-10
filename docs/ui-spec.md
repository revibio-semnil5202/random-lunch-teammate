# UI/UX 스펙

## 디자인 시스템

- **UI 라이브러리**: shadcn/ui (base-ui 기반)
- **스타일링**: Tailwind CSS v4
- **아이콘**: lucide-react
- **Primary 색상**: sky 계열 `oklch(0.637 0.196 262.881)`
- **폰트**: Pretendard Variable (CDN)
- **디자인 언어**: 그라데이션 카드 + 좌측 컬러바 + 원형 아이콘 뱃지

## 라우트 구조

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 대시보드 | 그룹 카드 목록 |
| `/groups/[id]` | 그룹 상세 | 모집중: 참여자 등록/삭제, 매칭완료: 결과 표시 |
| `/restaurants` | 식당 목록 | placeholder |

## 레이아웃

### 사이드바 (`src/components/app-sidebar.tsx`)
- **로고**: primary 배경 아이콘(Utensils) + "랜덤 점심 / 팀메이트" 2단 텍스트
- **구분선**: SidebarSeparator로 로고/메뉴 영역 분리
- **메뉴**: h-10 pill, 아이콘 18px, rounded-lg
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
- 컴포넌트: `GroupCard` (`src/components/group-card.tsx`)
- 레이아웃: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **카드 디자인**:
  - 좌측 컬러바 (bg-primary)
  - 그라데이션 배경 (from-primary/5 via-background to-primary/10)
  - 참여인원/진행일: 원형 아이콘 뱃지 + 가로 배치
  - 우측 ChevronRight, hover 시 -translate-y-0.5 + shadow-lg
- **그룹 상태 표시**:
  - 모집중 (`status: "recruiting"`): 상단 우측에 "모집중" 뱃지 (primary 색상)
  - 매칭완료 (`status: "matched"`): "결과보기" 뱃지 (green 계열) + 컬러바 green으로 변경

### 그룹 상세 - 모집중 (`/groups/[id]`)
- 오케스트레이터: `GroupDetail` (`src/components/group-detail.tsx`)
- **헤더**: 뒤로가기(대시보드) + 그라데이션 카드 (참여인원/진행일)
- **등록 폼**: `rounded-2xl border bg-card p-6` 카드 섹션
  - 소속 팀: `grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2`, pill 버튼
  - 이름: Input `text-base h-10 max-w-sm`
  - CTA 버튼: `h-12 max-w-sm`, UserPlus 아이콘, shadow
  - max-width 800px, 가운데 정렬
- **참여자 목록**: `rounded-2xl border bg-card p-6` 카드 섹션
  - 팀별 균등 grid (`grid-cols-2 md:3 lg:4 xl:5`)
  - 팀 헤더: border-b 구분선 + bold
  - 아이템: 팀명 뱃지(bg-primary/10) + 이름, hover 시 X 삭제 버튼

### 그룹 상세 - 매칭완료 (`/groups/[id]`)
- 오케스트레이터: `MatchResult` (`src/components/match-result.tsx`)
- **헤더**: 뒤로가기 + 그라데이션 카드 (매칭완료 뱃지 포함)
- **매칭 결과**: 랜덤 배정된 점심 조 카드 나열
  - 각 조: 번호 + 참여자 목록 (팀명 뱃지 스타일)
  - 카드: rounded-2xl border, 조 번호 헤더

## 그룹 상태 흐름

```
모집중 (recruiting)
  ↓ matchDeadline 도달 (ex: 03.11 11:00)
매칭완료 (matched)
  → matchResult에 랜덤 조 배정 결과 저장
```

## 반응형 Breakpoints

| 구분 | 너비 | 사이드바 | 카드 | 팀 라디오 | 참여자 목록 |
|------|------|---------|------|----------|------------|
| 모바일 | < 768px | 숨김 (햄버거) | 1열 | 3열 | 2열 |
| 태블릿 | 768-1024px | 접힘 가능 | 2열 | 5열 | 3열 |
| 데스크톱 | > 1024px | 펼침 | 3열 | 9열 | 4~5열 |
