"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { groupConfigs } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { GroupConfig, DayOfWeek } from "@/types";

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

  revalidatePath("/admin/groups");

  return toGroupConfig(row);
}

export async function updateGroupConfig(
  id: string,
  data: Omit<GroupConfig, "id" | "createdAt">
): Promise<GroupConfig> {
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

  revalidatePath("/admin/groups");

  return toGroupConfig(row);
}

export async function deleteGroupConfig(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const deleted = await db
    .delete(groupConfigs)
    .where(eq(groupConfigs.id, parseInt(id, 10)))
    .returning();

  if (deleted.length === 0) {
    return { success: false, error: "그룹 설정을 찾을 수 없습니다." };
  }

  revalidatePath("/admin/groups");

  return { success: true };
}
