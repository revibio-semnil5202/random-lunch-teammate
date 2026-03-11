import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const { user, supabaseResponse } = await updateSession(request);

    // 비로그인 → /login 리다이렉트
    if (!user && pathname !== "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      // 세션 쿠키가 있었는데 user가 null이면 토큰 만료
      const hadSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
      if (hadSession) {
        url.searchParams.set("error", "expired");
      }
      return NextResponse.redirect(url);
    }

    // 로그인 상태에서 /login 접근 → 대시보드로
    if (user && pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // 어드민 경로 보호
    if (user && pathname.startsWith("/admin")) {
      const role = user.app_metadata?.role;
      if (role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("error", "not_admin");
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch (e) {
    console.error("Middleware error:", e);
    // 미들웨어 에러 시 /login으로 폴백
    if (pathname !== "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "server_error");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
