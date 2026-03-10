"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { groupConfigs, lunchEvents } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import type { GroupConfig, DayOfWeek } from "@/types";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    throw new Error("관리자 권한이 필요합니다.");
  }
  return user;
}

function toGroupConfig(row: {
  id: number;
  title: string;
  schedule: string[];
  maxParticipants: number;
  matchDeadlineTime: string;
  slackChannelUrl: string | null;
  slackWebhookUrl: string | null;
  createdAt: Date;
}): GroupConfig {
  return {
    id: row.id.toString(),
    title: row.title,
    schedule: row.schedule as DayOfWeek[],
    maxParticipants: row.maxParticipants,
    matchDeadlineTime: row.matchDeadlineTime,
    slackChannelUrl: row.slackChannelUrl ?? undefined,
    slackWebhookUrl: row.slackWebhookUrl ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getGroupConfigs(): Promise<GroupConfig[]> {
  const rows = await db
    .select()
    .from(groupConfigs)
    .orderBy(groupConfigs.createdAt);

  return rows.map(toGroupConfig);
}

export async function createGroupConfig(
  data: Omit<GroupConfig, "id" | "createdAt">
): Promise<GroupConfig> {
  await requireAdmin();

  const [row] = await db
    .insert(groupConfigs)
    .values({
      title: data.title,
      schedule: data.schedule,
      maxParticipants: data.maxParticipants,
      matchDeadlineTime: data.matchDeadlineTime,
      slackChannelUrl: data.slackChannelUrl ?? null,
      slackWebhookUrl: data.slackWebhookUrl ?? null,
    })
    .returning();

  await ensureThisWeekEvent(row.id, row.schedule as DayOfWeek[], row.matchDeadlineTime);

  revalidatePath("/admin/groups");
  revalidatePath("/");

  return toGroupConfig(row);
}

export async function updateGroupConfig(
  id: string,
  data: Omit<GroupConfig, "id" | "createdAt">
): Promise<GroupConfig> {
  await requireAdmin();

  const [row] = await db
    .update(groupConfigs)
    .set({
      title: data.title,
      schedule: data.schedule,
      maxParticipants: data.maxParticipants,
      matchDeadlineTime: data.matchDeadlineTime,
      slackChannelUrl: data.slackChannelUrl ?? null,
      slackWebhookUrl: data.slackWebhookUrl ?? null,
    })
    .where(eq(groupConfigs.id, parseInt(id, 10)))
    .returning();

  await ensureThisWeekEvent(row.id, row.schedule as DayOfWeek[], row.matchDeadlineTime);

  revalidatePath("/admin/groups");
  revalidatePath("/");

  return toGroupConfig(row);
}

export async function deleteGroupConfig(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const deleted = await db
    .delete(groupConfigs)
    .where(eq(groupConfigs.id, parseInt(id, 10)))
    .returning();

  if (deleted.length === 0) {
    return { success: false, error: "그룹 설정을 찾을 수 없습니다." };
  }

  revalidatePath("/admin/groups");
  revalidatePath("/");

  return { success: true };
}

const KOREAN_DAY_MAP: Record<DayOfWeek, number> = {
  "월": 1, "화": 2, "수": 3, "목": 4, "금": 5,
};

/**
 * 이번 주 lunch_event를 생성하거나, 이미 있으면 날짜/시간을 갱신
 *
 * schedule 로테이션에서 이번 주에 해당하는 요일을 계산하고,
 * 아직 지나지 않은 요일이면 이벤트를 생성/갱신한다.
 */
async function ensureThisWeekEvent(
  groupConfigId: number,
  schedule: DayOfWeek[],
  matchDeadlineTime: string
) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + diffToMonday);

  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);

  const mondayStr = toDateStr(monday);
  const nextMondayStr = toDateStr(nextMonday);

  // 로테이션에서 이번 주 요일 결정
  const rotationIndex = 0 % schedule.length;
  const targetDay = schedule[rotationIndex];
  const targetDayNum = KOREAN_DAY_MAP[targetDay];

  // 이번 주 해당 요일의 날짜 계산
  const lunchDate = new Date(monday);
  lunchDate.setDate(monday.getDate() + (targetDayNum - 1));

  const [hours, minutes] = matchDeadlineTime.split(":").map(Number);
  const deadline = new Date(lunchDate);
  deadline.setHours(hours, minutes, 0, 0);

  // 이미 지난 날짜면 생성/갱신하지 않음
  if (deadline <= now) return;

  const lunchDateStr = toDateStr(lunchDate);

  // 이번 주 이벤트가 이미 있는지 확인
  const existing = await db
    .select({ id: lunchEvents.id, status: lunchEvents.status })
    .from(lunchEvents)
    .where(
      and(
        eq(lunchEvents.groupConfigId, groupConfigId),
        gte(lunchEvents.lunchDate, mondayStr),
        lt(lunchEvents.lunchDate, nextMondayStr)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // 이미 매칭 완료된 이벤트는 수정하지 않음
    if (existing[0].status === "matched") return;

    // 모집 중이면 날짜/시간 갱신
    await db
      .update(lunchEvents)
      .set({
        lunchDate: lunchDateStr,
        matchDeadline: deadline,
      })
      .where(eq(lunchEvents.id, existing[0].id));
    return;
  }

  await db.insert(lunchEvents).values({
    groupConfigId,
    lunchDate: lunchDateStr,
    matchDeadline: deadline,
    status: "recruiting",
  });
}

function toDateStr(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
