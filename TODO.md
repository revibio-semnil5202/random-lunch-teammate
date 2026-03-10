# TODO

## Phase 1 (현재) - 기본 UI + Mock 데이터

- [x] shadcn/ui 셋업 + sky/blue 테마
- [x] 타입 정의 (Participant, Group)
- [x] 상수 정의 (TEAMS)
- [x] Mock 데이터 생성
- [x] 사이드바 레이아웃 (반응형, 모바일 자동 닫기)
- [x] 대시보드 페이지 (그룹 카드 목록)
- [x] 그룹 상세 페이지
- [x] 참여자 등록 폼 (소속 팀 라디오 + 이름 입력)
- [x] 등록 확인 모달 + loading 처리
- [x] 참여자 목록 (팀별 그룹핑)
- [x] 참여자 삭제 + 확인 모달 + loading 처리
- [x] 회사 근처 식당 placeholder 페이지
- [x] 문서 생성 (db.md, api.md, ui-spec.md)

## Phase 2 - Supabase 연동

- [ ] DB 스키마 진화 (groups에 name/lunchDate 추가, members.department NOT NULL)
- [ ] Drizzle 마이그레이션 생성 및 실행
- [ ] Server Actions 구현 (getGroups, getGroupDetail, registerParticipant, deleteParticipant)
- [ ] Zod 입력값 검증
- [ ] revalidatePath 캐시 무효화
- [ ] 에러 핸들링 (toast 알림)

## Phase 3 - 랜덤 매칭

- [ ] 기존 createRandomMatch 서버 액션 연동
- [ ] 매칭 결과 표시 UI
- [ ] 매칭 히스토리

## Phase 4 - 회사 근처 식당

- [ ] 식당 목록 CRUD
- [ ] 지도 연동 (카카오맵 or 네이버맵)
- [ ] 식당 추천 기능
