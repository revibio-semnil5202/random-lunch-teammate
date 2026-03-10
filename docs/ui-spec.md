# UI/UX 스펙

## 디자인 시스템

- **UI 라이브러리**: shadcn/ui (base-ui 기반)
- **스타일링**: Tailwind CSS v4
- **아이콘**: lucide-react
- **Primary 색상**: sky-600 계열 `oklch(0.546 0.245 262.881)`
- **폰트**: Geist Sans / Geist Mono

## 라우트 구조

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 대시보드 | 그룹 카드 목록 |
| `/groups/[id]` | 그룹 상세 | 참여자 등록/삭제 |
| `/restaurants` | 식당 목록 | placeholder |

## 레이아웃

### 사이드바 (`src/components/app-sidebar.tsx`)
- shadcn Sidebar 컴포넌트 사용
- 메뉴: 대시보드 (LayoutDashboard), 회사 근처 식당 (UtensilsCrossed)
- 활성 라우트 하이라이팅 (primary 색상)
- `/groups/*` 경로에서 "대시보드" 활성
- 모바일: 메뉴 클릭 시 `setOpenMobile(false)` → 자동 닫기

### 헤더 (`src/components/sidebar-layout.tsx`)
- SidebarTrigger (모바일 햄버거)
- 구분선 + 앱 타이틀

## 페이지별 스펙

### 대시보드 (`/`)
- 컴포넌트: `GroupCard` (`src/components/group-card.tsx`)
- 레이아웃: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- 카드: shadcn Card, hover 시 shadow + border-primary/50

### 그룹 상세 (`/groups/[id]`)
- 오케스트레이터: `GroupDetail` (`src/components/group-detail.tsx`)

#### 참여자 등록 폼 (`src/components/participant-form.tsx`)
- 소속 팀: 커스텀 라디오 버튼 (shadcn RadioGroup 대신 button 스타일)
  - `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2`
  - 선택 시: `bg-primary text-primary-foreground`
- 이름: shadcn Input, `maxLength={10}`, `max-w-xs`
- 등록 버튼: 필수값 미입력 시 disabled

#### 등록 확인 모달 (`src/components/register-confirm-dialog.tsx`)
- 메시지: "{진행일} {그룹명} 랜덤 팀점에 '{소속팀}/{이름}'(으)로 참여하시겠습니까?"
- 확인 시: Loader2 스피너 + 버튼 disabled → 완료 후 모달 닫기

#### 참여자 목록 (`src/components/participant-list.tsx`)
- 팀별 그룹핑 (reduce + Object.keys.sort)
- 팀 헤더: 팀명 + Badge(인원수)
- 아이템 그리드: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2`
- 빈 상태: "아직 참여자가 없습니다."

#### 참여자 아이템 (`src/components/participant-item.tsx`)
- 표시: `{소속팀} / {이름}` (팀명은 primary 색상)
- 스타일: rounded-lg border, hover:bg-accent
- X 버튼: `opacity-0 group-hover:opacity-100`, 우측 상단

#### 삭제 확인 모달 (`src/components/delete-confirm-dialog.tsx`)
- 메시지: "{소속팀}/{이름}을(를) 삭제하시겠습니까? 본인이 맞는지 확인해주세요."
- 삭제 버튼: `variant="destructive"` + Loader2 스피너

## 반응형 Breakpoints

| 구분 | 너비 | 사이드바 | 카드 | 팀 라디오 | 참여자 목록 |
|------|------|---------|------|----------|------------|
| 모바일 | < 768px | 숨김 (햄버거) | 1열 | 2열 | 2열 |
| 태블릿 | 768-1024px | 접힘 가능 | 2열 | 4열 | 3열 |
| 데스크톱 | > 1024px | 펼침 | 3열 | 8열 | 4열 |
