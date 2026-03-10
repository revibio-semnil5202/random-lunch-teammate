# 인증 설정 가이드

## 1. 환경변수

`.env.local` (로컬) 및 Vercel 환경변수에 등록:

| 변수 | 설명 | 위치 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Supabase > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개 anon 키 | Supabase > Settings > API > anon public |
| `DATABASE_URL` | PostgreSQL 연결 문자열 (Session Pooler) | 기존 사용 중 |
| `CRON_SECRET` | Cron API 인증 토큰 | 기존 사용 중 |
| `APP_URL` | 서비스 배포 URL (슬랙 알림 링크용) | 기존 사용 중 |

> `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 기존에 등록되어 있어야 합니다.
> 새로 추가할 환경변수는 **없습니다**.

---

## 2. Supabase 세션 설정

쿠키 만료일은 코드에서 **30일**로 설정되어 있습니다.

Supabase Dashboard에서 JWT 만료 시간도 맞춰 설정하세요:

1. Supabase Dashboard > **Authentication** > **Settings**
2. **JWT Expiry** (Access Token Lifetime): 기본 3600초 (1시간) → 그대로 유지
3. **Refresh Token Rotation**: 활성화 권장

> Access Token은 1시간마다 자동 갱신되며, 쿠키(Refresh Token)가 30일간 유지되어
> 브라우저를 닫았다 열어도 30일 내에는 재로그인 없이 사용 가능합니다.

---

## 3. 유저 생성

### 일반 유저 생성

Supabase Dashboard > **Authentication** > **Users** > **Add User** > **Create new user**

- Email: 사용자 이메일
- Password: 비밀번호
- Auto Confirm: 체크 (이메일 인증 건너뜀)

### 관리자 유저 생성

1. 위와 같은 방법으로 유저 먼저 생성
2. Supabase **SQL Editor**에서 아래 실행:

```sql
-- 관리자 역할 부여 (이메일 수정 후 실행)
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

### 관리자 역할 확인

```sql
SELECT email, raw_app_meta_data->>'role' AS role
FROM auth.users
ORDER BY created_at;
```

### 관리자 역할 제거

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data - 'role'
WHERE email = 'admin@example.com';
```

---

## 4. 인증 흐름

```
비로그인 → 모든 페이지 → /login 리다이렉트

일반 유저 로그인 → 대시보드, 식당, 그룹 상세 접근 가능
                 → 사이드바 "그룹 관리" 숨김
                 → /admin/* URL 직접 접근 시:
                   세션 삭제 + "관리자 계정이 아닙니다" 토스트 + /login 리다이렉트

관리자 로그인 → 모든 페이지 접근 가능 (그룹 관리 포함)
```

---

## 5. DB 변경사항

**없음.** 인증은 Supabase Auth (`auth` 스키마)가 관리하며, 기존 커스텀 테이블(`members`, `group_configs`, `lunch_events`, `event_participants`, `match_results`)은 변경 불필요합니다.

기존 RLS 정책:
- `anon`: 읽기 + 참여자 등록/삭제
- `authenticated`: 모든 테이블 전체 권한

로그인 후 Supabase 클라이언트가 자동으로 `authenticated` 역할로 요청하므로 RLS가 정상 동작합니다.

---

## 6. 관련 파일

| 파일 | 역할 |
|------|------|
| `src/lib/supabase/client.ts` | 브라우저 Supabase 클라이언트 (쿠키 30일) |
| `src/lib/supabase/server.ts` | 서버 Supabase 클라이언트 (쿠키 30일) |
| `src/lib/supabase/middleware.ts` | 미들웨어 세션 리프레시 (쿠키 30일) |
| `src/middleware.ts` | 라우팅 보호 (비로그인 리다이렉트, 어드민 가드) |
| `src/app/login/page.tsx` | 로그인 페이지 |
| `src/components/login-form.tsx` | 로그인 폼 UI |
| `src/hooks/use-user.ts` | 클라이언트 유저 훅 (isAdmin 판별) |
| `src/actions/auth.ts` | signOut 서버 액션 |
| `src/actions/admin.ts` | requireAdmin() 서버사이드 가드 |
