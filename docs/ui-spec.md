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
| `/groups/[id]` | 그룹 상세 | 모집중: 참여자 등록/삭제, 매칭완료: 리빌 연출 + 결과 표시, 과거 기록: 결과 바로 표시 |
| `/admin/groups` | 그룹 관리 (어드민) | 그룹 설정 CRUD, 요일 로테이션, 최대 인원. Phase 2에서 Supabase 인증 필요 |
| `/restaurants` | 회사 근처 식당 | Google Sheets 연동, 검색/필터, 네이버 지도 링크 |

## 레이아웃

### 사이드바 (`src/components/app-sidebar.tsx`)
- **로고**: primary 배경 아이콘(Utensils) + "랜덤 점심 / 팀메이트" 2단 텍스트, `/` 링크
- **구분선**: SidebarSeparator로 로고/메뉴 영역 분리
- **메뉴**: h-10 pill, 아이콘 18px, rounded-lg, text-base (16px)
  - 대시보드 (LayoutDashboard)
  - 그룹 관리 (FolderCog) — Phase 2에서 어드민 인증 시에만 노출
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
  - 좌측 컬러바 (모집중: bg-primary, 매칭완료: bg-emerald-500)
  - 그라데이션 배경
  - 참여인원/진행일: 원형 아이콘 뱃지 + 가로 배치
  - 우측 ChevronRight, hover 시 -translate-y-0.5 + shadow-lg
- **그룹 상태 표시**:
  - 모집중: "모집중" 뱃지 (Clock 아이콘, primary 색상)
  - 매칭완료: "결과보기" 뱃지 (Trophy 아이콘, emerald 색상)

#### 과거 기록 테이블
- 컴포넌트: `PastMatchTable` (`src/components/past-match-table.tsx`)
- Trophy 아이콘 + "지난 팀점 기록" 제목
- `rounded-xl border` 테이블, 칼럼: 그룹 이름 / 진행일
- 각 row 클릭 → `/groups/[id]` 상세 페이지 이동 (리빌/콘페티 없이 결과 바로 노출)
- hover 시 bg-accent + ChevronRight 이동 효과
- Trophy 아이콘: emerald 색상

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
  - 완료 후 콘페티 3회 발사 (양측 하단, canvas-confetti, emerald+blue+violet)
  - 결과 페이지 fade-in + slide-in-from-bottom
  - `document.cookie`에 12시간 쿠키 설정
- **재방문** (쿠키 있을 때):
  - 서버에서 `cookies()` 로 확인 → `alreadySeen` prop → 바로 결과 렌더 (hydration 안전)

#### 매칭 결과 (`src/components/match-result.tsx`)
- **헤더**: 뒤로가기 + 그라데이션 카드 (emerald 톤)
  - 매칭 완료 뱃지: 모바일 → 타이틀 위, PC → 타이틀 오른쪽
  - 참여인원 / 진행일 / 조 수 stats
  - 슬랙 바로가기 버튼: Slack 브랜드 컬러 (`#4A154B`), 로고 SVG, ExternalLink 아이콘
    - `slackChannelUrl` 있을 때만 렌더, `target="_blank"`
- **매칭 결과 조 카드**: `grid md:grid-cols-2`
  - 각 조: emerald 넘버 원형 + 멤버 리스트 (팀명 뱃지 스타일)

#### 스켈레톤 로딩 (`src/app/groups/[id]/loading.tsx`)
- Next.js App Router Suspense boundary로 자동 동작
- MatchResult UI 구조와 동일한 레이아웃: 헤더 카드 + 조 카드 2개
- `animate-pulse`로 로딩 상태 표현
- 과거 기록 및 DB fetch 시 데이터 로딩 중 자동 표시

## 색상 체계

| 상태 | 컬러바 | 뱃지 배경 | 텍스트 |
|------|--------|----------|--------|
| 모집중 | bg-primary | bg-primary/10 | text-primary |
| 매칭완료 | bg-emerald-500 | bg-emerald-100 | text-emerald-700 |
| 삭제 버튼 | - | bg-rose-400 | text-white |

## 그룹 상태 흐름

```
모집중 (recruiting)
  ↓ matchDeadline 도달 (ex: 03.11 11:00)
매칭완료 (matched)
  → matchResult에 랜덤 조 배정 결과 저장
  → 첫 방문 시 리빌 연출 (3.5초) + 콘페티 (진행중 그룹만)
  → 12시간 쿠키로 재방문 시 바로 결과 노출
  → 과거 기록은 리빌/콘페티 없이 MatchResult 바로 표시
```

### 그룹 관리 - 어드민 (`/admin/groups`)
- 오케스트레이터: `GroupManagement` (`src/components/group-management.tsx`)
- **인증**: Phase 2에서 Supabase 어드민 로그인 필요 (현재 미인증 상태에서도 접근 가능)

#### 그룹 설정 카드 목록
- 각 카드: `rounded-xl border bg-card p-5`
- **제목**: `text-lg font-bold`
- **뱃지들**: 요일 스케줄 (CalendarDays), 최대 인원 (Users), 마감 시각 (Clock)
  - 로테이션 요일: `수 → 목 반복` 또는 `매주 수요일` 형태
- **액션 버튼**: 수정 (Pencil), 삭제 (Trash2) — hover 시 표시
- **빈 상태**: 점선 border + "등록된 그룹이 없습니다" + 추가 버튼

#### 그룹 추가/수정 폼 (`src/components/group-config-form.tsx`)
- Dialog 기반 (DialogContent)
- **그룹 이름**: Input `text-base`
- **요일 로테이션 (schedule)**:
  - 주차별 요일 선택 UI: `1주차`, `2주차`, ... 라벨 + 요일 pill 버튼 (월~금)
  - `+ 주차 추가` 버튼으로 로테이션 주기 확장
  - 각 주차 X 버튼으로 삭제 가능 (최소 1주차는 유지)
  - **미리보기**: 1주차만 → `매주 {요일}요일`, 2주차 이상 → `{요일} → {요일} 반복`
- **최대 참여 인원**: Input `type="number"` (최소 3, 최대 12, 기본값 4, 스피너 화살표 제거)
  - 라벨 하단 12px: "최소 인원은 3명으로 고정됩니다."
- **매칭 마감 시각**: Input `type="time"` (기본값 11:00)
  - 라벨 하단 12px: "이 시간에 매칭 결과가 자동으로 발표됩니다."
- **슬랙 채널 바로가기**: Input (선택)
  - 라벨 하단 12px: "매칭 결과 페이지에서 슬랙 채널로 이동하는 버튼에 사용됩니다."
- **슬랙 알림 Webhook**: Input (선택)
  - 라벨 하단 12px: "참여 안내, 마감 리마인더, 매칭 결과를 자동으로 슬랙에 발송합니다."

#### 삭제 확인
- AlertDialog: 그룹 이름 볼드 + "삭제하시겠습니까?"

### 회사 근처 식당 (`/restaurants`)
- 서버 컴포넌트에서 Google Sheets 공개 CSV fetch (`force-dynamic`)
- 클라이언트 컴포넌트: `RestaurantList` (`src/components/restaurant-list.tsx`)

#### 헤더
- "회사 근처 식당" + 카운트 Badge (`bg-primary/10`)
- **식당 추가 버튼**: primary 컬러, Plus 아이콘, Google Sheets 새 탭 열기
  - PC: `+ 식당 추가`, 모바일: `+` 아이콘만

#### 검색 & 필터
- `rounded-2xl border` 그라데이션 카드 안에 배치
- **검색**: Search 아이콘 + Input (`h-10`), 식당 이름으로 실시간 필터
- **필터 드롭다운**: Select (`!h-10`, `min-w-[160px]`)
  - 음식 종류: 라벨 항상 표시 ("음식 종류: 전체" → "음식 종류: 한식")
  - 식대 유무: 라벨 항상 표시 ("식대: 전체" → "식대: 가능")
  - 모바일: `flex-1` 균등 분할
- **활성 필터 태그**: `rounded-full bg-primary/10` pill, 개별 X 버튼으로 제거
- **초기화 버튼**: 모바일에서는 X 아이콘만

#### 식당 카드 (갤러리 그리드)
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- GroupCard 디자인 패턴 적용: `rounded-2xl border` + 좌측 컬러바 + 그라데이션 배경
- hover: `-translate-y-0.5 shadow-lg`
- 상단: 식당명 (font-bold) + 카테고리 뱃지 (`rounded-full bg-primary/10`)
- 하단: 식대 유무 (CreditCard 아이콘) + 네이버 지도 버튼 (`bg-[#03C75A]`, MapPin 아이콘)

#### 토스트
- 페이지 진입 시 info 토스트: "시트에 식당을 추가하면 약 5분 뒤 반영됩니다." (4초)
- PC: `top-center`, 모바일: `bottom-center`

#### SEO
- 전체 페이지 `robots: { index: false, follow: false }` — 사내 서비스

## 반응형 Breakpoints

| 구분 | 너비 | 사이드바 | 카드 | 팀 선택 | 참여자 목록 |
|------|------|---------|------|---------|------------|
| 모바일 | < 768px | 숨김 (햄버거) | 1열 | flex-wrap | 2열 |
| 태블릿 | 768-1024px | 접힘 가능 | 2열 | flex-wrap | 3열 |
| 데스크톱 | > 1024px | 펼침 | 3열 | flex-wrap | 4~5열 |
