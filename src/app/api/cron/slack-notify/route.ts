import { NextResponse } from "next/server";
import { db } from "@/db";
import { groupConfigs, lunchEvents, eventParticipants } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { sendWeeklyNotice, sendDeadlineReminder } from "@/lib/slack";

/**
 * 슬랙 알림 발송 API
 *
 * type=weekly  → 주간 참여 안내 (매주 월요일 10시)
 * type=reminder → 마감 전 리마인더 (매칭 당일 마감 1시간 전)
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type !== "weekly" && type !== "reminder") {
    return NextResponse.json(
      { error: "type 파라미터가 필요합니다. (weekly | reminder)" },
      { status: 400 }
    );
  }

  // webhook URL이 설정된 그룹 설정 조회
  const activeConfigs = await db
    .select()
    .from(groupConfigs)
    .where(isNotNull(groupConfigs.slackWebhookUrl));

  if (activeConfigs.length === 0) {
    return NextResponse.json({
      message: "Webhook URL이 설정된 그룹이 없습니다.",
      sent: 0,
    });
  }

  const results: { groupTitle: string; success: boolean; error?: string }[] =
    [];

  for (const config of activeConfigs) {
    // 현재 모집 중인 이벤트 조회
    const events = await db
      .select()
      .from(lunchEvents)
      .where(
        and(
          eq(lunchEvents.groupConfigId, config.id),
          eq(lunchEvents.status, "recruiting")
        )
      )
      .limit(1);

    if (events.length === 0) {
      results.push({
        groupTitle: config.title,
        success: false,
        error: "모집 중인 이벤트 없음",
      });
      continue;
    }

    const event = events[0];

    // 참여자 수 조회
    const participants = await db
      .select({ id: eventParticipants.id })
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, event.id));

    const participantCount = participants.length;
    const eventId = event.id.toString();

    try {
      if (type === "weekly") {
        // 점심 날짜에서 요일 추출
        const lunchDate = new Date(event.lunchDate);
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        const lunchDay = `${days[lunchDate.getDay()]}요일 (${event.lunchDate})`;

        await sendWeeklyNotice(
          config.slackWebhookUrl!,
          config.title,
          lunchDay,
          participantCount,
          eventId
        );
      } else {
        await sendDeadlineReminder(
          config.slackWebhookUrl!,
          config.title,
          config.matchDeadlineTime,
          participantCount,
          eventId
        );
      }

      results.push({ groupTitle: config.title, success: true });
    } catch (e) {
      results.push({
        groupTitle: config.title,
        success: false,
        error: String(e),
      });
    }
  }

  const sent = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return NextResponse.json({
    message: `${type} 알림: 성공 ${sent}건, 실패 ${failed}건`,
    sent,
    failed,
    results,
  });
}
