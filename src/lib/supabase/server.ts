import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30일

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        maxAge: COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax" as const,
        secure: true,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll은 Server Component에서 호출될 수 있으며,
            // 이 경우 쿠키 설정이 불가하므로 무시합니다.
            // 미들웨어에서 세션 리프레시가 처리됩니다.
          }
        },
      },
    }
  );
}
