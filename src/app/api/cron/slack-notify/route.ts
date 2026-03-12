import { NextResponse } from "next/server";
import { db } from "@/db";
import { groupConfigs, lunchEvents, eventParticipants } from "@/db/schema";
import { eq, and, gte, lte, isNull } from "drizzle-orm";
import { sendWeeklyNotice, sendDeadlineReminder } from "@/lib/slack";
import { ensureThisWeekEvent } from "@/actions/admin";
import type { DayOfWeek } from "@/types";

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

  // weekly 알림 시 이번 주 이벤트 자동 생성
  if (type === "weekly") {
    const allConfigs = await db.select().from(groupConfigs);
    await Promise.allSettled(
      allConfigs.map((c) =>
        ensureThisWeekEvent(c.id, c.schedule as DayOfWeek[], c.matchDeadlineTime, c.maxRounds)
      )
    );
  }

  if (type === "reminder") {
    return handleReminder();
  }

  return handleWeekly();
}

/** 주간 참여 안내: 모든 그룹의 이벤트 생성 + 슬랙 발송 */
async function handleWeekly() {
  // 이번 주 이벤트 자동 생성
  const allConfigs = await db.select().from(groupConfigs);
  await Promise.allSettled(
    allConfigs.map((c) =>
      ensureThisWeekEvent(c.id, c.schedule as DayOfWeek[], c.matchDeadlineTime, c.maxRounds)
    )
  );

  // webhook URL이 설정된 그룹만
  const activeConfigs = allConfigs.filter((c) => c.slackWebhookUrl);

  const results: { groupTitle: string; success: boolean; error?: string }[] = [];

  for (const config of activeConfigs) {
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
      results.push({ groupTitle: config.title, success: false, error: "모집 중인 이벤트 없음" });
      continue;
    }

    const event = events[0];

    try {
      const lunchDate = new Date(event.lunchDate);
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const lunchDay = `${days[lunchDate.getDay()]}요일 (${event.lunchDate})`;

      await sendWeeklyNotice(
        config.slackWebhookUrl!,
        config.title,
        lunchDay,
        event.id.toString()
      );
      results.push({ groupTitle: config.title, success: true });
    } catch (e) {
      results.push({ groupTitle: config.title, success: false, error: String(e) });
    }
  }

  const sent = results.filter((r) => r.success).length;
  return NextResponse.json({ message: `weekly 알림: 성공 ${sent}건`, sent, results });
}

/** 마감 리마인더: 마감 0~60분 전인 이벤트에 1회만 발송 */
async function handleReminder() {
  const now = new Date();
  const min60 = new Date(now.getTime() + 60 * 60 * 1000);

  // 마감이 0~60분 후인 모집 중 이벤트 중, 아직 리마인더를 보내지 않은 이벤트만 조회
  const upcomingEvents = await db
    .select({
      eventId: lunchEvents.id,
      matchDeadline: lunchEvents.matchDeadline,
      configId: lunchEvents.groupConfigId,
    })
    .from(lunchEvents)
    .where(
      and(
        eq(lunchEvents.status, "recruiting"),
        gte(lunchEvents.matchDeadline, now),
        lte(lunchEvents.matchDeadline, min60),
        isNull(lunchEvents.reminderSentAt)
      )
    );

  if (upcomingEvents.length === 0) {
    return NextResponse.json({ message: "리마인더 대상 이벤트 없음", sent: 0 });
  }

  const results: { groupTitle: string; success: boolean; error?: string }[] = [];

  for (const event of upcomingEvents) {
    const configs = await db
      .select()
      .from(groupConfigs)
      .where(eq(groupConfigs.id, event.configId))
      .limit(1);

    if (configs.length === 0 || !configs[0].slackWebhookUrl) continue;

    const config = configs[0];
    const participants = await db
      .select({ id: eventParticipants.id })
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, event.eventId));

    try {
      await sendDeadlineReminder(
        config.slackWebhookUrl!,
        config.title,
        config.matchDeadlineTime,
        participants.length,
        event.eventId.toString()
      );

      await db
        .update(lunchEvents)
        .set({ reminderSentAt: now })
        .where(eq(lunchEvents.id, event.eventId));

      results.push({ groupTitle: config.title, success: true });
    } catch (e) {
      results.push({ groupTitle: config.title, success: false, error: String(e) });
    }
  }

  const sent = results.filter((r) => r.success).length;
  return NextResponse.json({ message: `reminder 알림: 성공 ${sent}건`, sent, results });
}
