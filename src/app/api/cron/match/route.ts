import { NextResponse } from "next/server";
import { db } from "@/db";
import { lunchEvents } from "@/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { createRandomMatch } from "@/actions/match";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const overdueEvents = await db
    .select({ id: lunchEvents.id })
    .from(lunchEvents)
    .where(
      and(
        eq(lunchEvents.status, "recruiting"),
        lte(lunchEvents.matchDeadline, now)
      )
    );

  if (overdueEvents.length === 0) {
    return NextResponse.json({ message: "처리할 이벤트가 없습니다.", processed: 0 });
  }

  const results = await Promise.allSettled(
    overdueEvents.map((event) => createRandomMatch(event.id.toString()))
  );

  const summary = results.map((result, i) => {
    const eventId = overdueEvents[i].id;
    if (result.status === "fulfilled") {
      return { eventId, success: result.value.success, message: result.value.message };
    }
    return { eventId, success: false, message: String(result.reason) };
  });

  const succeeded = summary.filter((s) => s.success).length;
  const failed = summary.filter((s) => !s.success).length;

  return NextResponse.json({
    message: `매칭 완료: 성공 ${succeeded}건, 실패 ${failed}건`,
    processed: overdueEvents.length,
    summary,
  });
}
