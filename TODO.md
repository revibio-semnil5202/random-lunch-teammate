# TODO

## Phase 1 - 기본 UI + Mock 데이터

- [x] shadcn/ui 셋업 + sky/blue 테마
- [x] Pretendard Variable 폰트 적용
- [x] 타입 정의 (Participant, Group)
- [x] 상수 정의 (TEAMS - 9개 팀, 디자인팀 포함)
- [x] Mock 데이터 생성
- [x] 사이드바 레이아웃 (로고 아이콘, pill 메뉴, 반응형, 모바일 자동 닫기)
- [x] 대시보드 페이지 (그라데이션 카드 + 컬러바 디자인)
- [x] 그룹 상세 페이지 (카드 섹션 분리, 뒤로가기)
- [x] 참여자 등록 폼 (9열 라디오, CTA 버튼, max-w 800px)
- [x] 등록 확인 모달 + loading 처리
- [x] 참여자 목록 (팀별 균등 grid, 뱃지 스타일)
- [x] 참여자 삭제 + 확인 모달 + loading 처리
- [x] 회사 근처 식당 placeholder 페이지
- [x] 문서 생성 (db.md, api.md, ui-spec.md)
- [x] 모든 Button cursor-pointer 기본 적용

## Phase 1.5 - 매칭 결과

- [ ] Group 타입에 status, matchDeadline, matchResult 추가
- [ ] 그룹 카드 상태 표시 (모집중/결과보기 뱃지)
- [ ] 매칭완료 그룹 카드 디자인 (green 컬러바)
- [ ] 매칭 결과 페이지 (`MatchResult` 컴포넌트)
- [ ] 매칭 결과 mock 데이터 (Fisher-Yates 셔플 기반 조 배정)
- [ ] /groups/[id] 페이지에서 status 분기 (모집중 → GroupDetail, 매칭완료 → MatchResult)

## Phase 2 - Supabase 연동

- [ ] DB 스키마 진화 (groups 확장, match_results 테이블 추가)
- [ ] Drizzle 마이그레이션 생성 및 실행
- [ ] Server Actions 구현 (getGroups, getGroupDetail, registerParticipant, deleteParticipant)
- [ ] executeMatch 서버 액션 (기존 createRandomMatch 재활용)
- [ ] Zod 입력값 검증
- [ ] revalidatePath 캐시 무효화
- [ ] 에러 핸들링 (toast 알림)

## Phase 3 - 자동화

- [ ] matchDeadline 기반 자동 매칭 (Supabase Edge Function or cron)
- [ ] 매칭 히스토리 조회

## Phase 4 - 회사 근처 식당

- [ ] 식당 목록 CRUD
- [ ] 지도 연동 (카카오맵 or 네이버맵)
- [ ] 식당 추천 기능
