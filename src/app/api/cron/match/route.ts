import { NextResponse } from "next/server";
import { createRandomMatch } from "@/actions/match";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Phase 2 - Supabase 연동 시 아래로 교체
  // 1. groups 테이블에서 status="recruiting" AND match_deadline <= now() 조회
  // 2. 각 그룹의 참여자 목록 조회 (group_members JOIN members)
  // 3. createMatch(participants, { maxGroupSize: group.max_group_size }) 실행
  // 4. 결과를 match_results 테이블에 저장
  // 5. groups.status를 "matched"로 업데이트

  const result = await createRandomMatch();

  if (!result.success) {
    return NextResponse.json(
      { error: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "매칭이 완료되었습니다.",
    groups: result.groups,
  });
}
