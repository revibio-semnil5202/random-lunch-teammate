"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  lunchEvents,
  groupConfigs,
  eventParticipants,
  members,
  matchResults,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { createMatch } from "@/lib/match";
import { sendMatchResult } from "@/lib/slack";

export async function createRandomMatch(eventId: string): Promise<{
  success: boolean;
  message?: string;
  groups?: { groupIndex: number; memberIds: number[] }[];
}> {
  const eventIdNum = parseInt(eventId, 10);

  // 이벤트 + 그룹 설정 조회
  const eventRows = await db
    .select({
      id: lunchEvents.id,
      status: lunchEvents.status,
      maxParticipants: groupConfigs.maxParticipants,
      groupTitle: groupConfigs.title,
      slackWebhookUrl: groupConfigs.slackWebhookUrl,
    })
    .from(lunchEvents)
    .innerJoin(groupConfigs, eq(lunchEvents.groupConfigId, groupConfigs.id))
    .where(eq(lunchEvents.id, eventIdNum))
    .limit(1);

  if (eventRows.length === 0) {
    return { success: false, message: "이벤트를 찾을 수 없습니다." };
  }

  const event = eventRows[0];

  // 참여자 목록 조회
  const participantRows = await db
    .select({
      id: members.id,
      name: members.name,
      department: members.department,
      createdAt: eventParticipants.createdAt,
    })
    .from(eventParticipants)
    .innerJoin(members, eq(eventParticipants.memberId, members.id))
    .where(eq(eventParticipants.eventId, eventIdNum));

  const result = createMatch(participantRows, {
    maxGroupSize: event.maxParticipants,
  });

  if (!result.success || !result.groups) {
    return { success: false, message: result.message };
  }

  // 기존 매칭 결과 삭제 후 재저장
  await db.delete(matchResults).where(eq(matchResults.eventId, eventIdNum));

  const savedGroups: { groupIndex: number; memberIds: number[] }[] = [];

  for (let i = 0; i < result.groups.length; i++) {
    const group = result.groups[i];
    const groupIndex = i + 1;

    await db.insert(matchResults).values(
      group.map((member) => ({
        eventId: eventIdNum,
        matchGroupIndex: groupIndex,
        memberId: member.id,
      }))
    );

    savedGroups.push({
      groupIndex,
      memberIds: group.map((m) => m.id),
    });
  }

  // 이벤트 상태를 'matched'로 업데이트
  await db
    .update(lunchEvents)
    .set({ status: "matched" })
    .where(eq(lunchEvents.id, eventIdNum));

  revalidatePath("/");
  revalidatePath(`/groups/${eventId}`);

  // 슬랙 매칭 결과 알림
  if (event.slackWebhookUrl) {
    const totalMembers = participantRows.length;
    const groupCount = savedGroups.length;
    try {
      await sendMatchResult(
        event.slackWebhookUrl,
        event.groupTitle,
        groupCount,
        totalMembers,
        eventId
      );
    } catch (e) {
      console.error("슬랙 매칭 결과 알림 실패:", e);
    }
  }

  return { success: true, groups: savedGroups };
}
