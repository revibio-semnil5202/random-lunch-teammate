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
import { eq, desc, notInArray, sql } from "drizzle-orm";
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

  // 과거 기록 10개 초과 시 오래된 이벤트 자동 삭제
  await cleanupOldEvents();

  return { success: true, groups: savedGroups };
}

const PAST_EVENTS_LIMIT = 20;

async function cleanupOldEvents() {
  try {
    // 최근 매칭 완료된 이벤트 ID 10개 조회
    const recentEvents = await db
      .select({ id: lunchEvents.id })
      .from(lunchEvents)
      .where(eq(lunchEvents.status, "matched"))
      .orderBy(desc(lunchEvents.lunchDate))
      .limit(PAST_EVENTS_LIMIT);

    if (recentEvents.length < PAST_EVENTS_LIMIT) return;

    const keepIds = recentEvents.map((e) => e.id);

    // 보존 대상이 아닌 오래된 matched 이벤트 조회
    const oldEvents = await db
      .select({ id: lunchEvents.id })
      .from(lunchEvents)
      .where(eq(lunchEvents.status, "matched"));

    const deleteIds = oldEvents
      .map((e) => e.id)
      .filter((id) => !keepIds.includes(id));

    if (deleteIds.length === 0) return;

    // 관련 데이터 삭제 (matchResults → eventParticipants → lunchEvents)
    for (const id of deleteIds) {
      await db.delete(matchResults).where(eq(matchResults.eventId, id));
      await db.delete(eventParticipants).where(eq(eventParticipants.eventId, id));
      await db.delete(lunchEvents).where(eq(lunchEvents.id, id));
    }

    // 고아 members 정리: 어떤 eventParticipants에도 참조되지 않는 member 삭제
    const referencedMemberIds = db
      .select({ memberId: eventParticipants.memberId })
      .from(eventParticipants);

    await db
      .delete(members)
      .where(
        notInArray(members.id, sql`(${referencedMemberIds})`)
      );
  } catch (e) {
    console.error("과거 기록 정리 실패:", e);
  }
}
