"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { members, lunchEvents, eventParticipants } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Participant, GroupType } from "@/types";

export async function registerParticipant({
  eventId,
  team,
  name,
  groupType = "company",
}: {
  eventId: string;
  team: string;
  name: string;
  groupType?: GroupType;
}): Promise<
  | { success: true; participant: Participant }
  | { success: false; error: string }
> {
  const trimmedName = name.trim();
  const trimmedTeam = team.trim();

  if (!trimmedName) {
    return { success: false, error: "이름을 입력해 주세요." };
  }

  if (groupType === "company" && !trimmedTeam) {
    return { success: false, error: "소속을 입력해 주세요." };
  }

  if (trimmedName.length > 10) {
    return {
      success: false,
      error: "이름은 최대 10자까지 입력할 수 있습니다.",
    };
  }

  const eventIdNum = parseInt(eventId, 10);

  const eventRows = await db
    .select({
      id: lunchEvents.id,
      status: lunchEvents.status,
    })
    .from(lunchEvents)
    .where(eq(lunchEvents.id, eventIdNum))
    .limit(1);

  if (eventRows.length === 0) {
    return { success: false, error: "이벤트를 찾을 수 없습니다." };
  }

  const event = eventRows[0];

  if (event.status !== "recruiting") {
    return {
      success: false,
      error: "현재 참여 신청을 받지 않는 이벤트입니다.",
    };
  }

  // 현재 참여자 목록 조회 (중복 확인)
  const currentParticipants = await db
    .select({
      memberId: eventParticipants.memberId,
      name: members.name,
      department: members.department,
    })
    .from(eventParticipants)
    .innerJoin(members, eq(eventParticipants.memberId, members.id))
    .where(eq(eventParticipants.eventId, eventIdNum));

  const duplicate = currentParticipants.some(
    (p) => p.department === trimmedTeam && p.name === trimmedName,
  );
  if (duplicate) {
    return {
      success: false,
      error:
        groupType === "team"
          ? "이미 동일한 이름으로 참여 신청이 되어 있습니다."
          : "이미 동일한 팀/이름으로 참여 신청이 되어 있습니다.",
    };
  }

  // members 테이블에 INSERT
  const [newMember] = await db
    .insert(members)
    .values({ name: trimmedName, department: trimmedTeam })
    .returning();

  // event_participants 테이블에 INSERT
  const [newEp] = await db
    .insert(eventParticipants)
    .values({ eventId: eventIdNum, memberId: newMember.id })
    .returning();

  revalidatePath("/");
  revalidatePath(`/groups/${eventId}`);

  return {
    success: true,
    participant: {
      id: newMember.id.toString(),
      team: newMember.department ?? "",
      name: newMember.name,
      createdAt: newEp.createdAt.toISOString(),
    },
  };
}

export async function deleteParticipant({
  eventId,
  participantId,
  cancelReason,
}: {
  eventId: string;
  participantId: string;
  cancelReason: string;
}): Promise<{ success: boolean; error?: string }> {
  const eventIdNum = parseInt(eventId, 10);
  const memberIdNum = parseInt(participantId, 10);

  const updated = await db
    .update(eventParticipants)
    .set({
      cancelledAt: new Date(),
      cancelReason: cancelReason.trim() || "개인사정",
    })
    .where(
      and(
        eq(eventParticipants.eventId, eventIdNum),
        eq(eventParticipants.memberId, memberIdNum),
      ),
    )
    .returning();

  if (updated.length === 0) {
    return { success: false, error: "참여자를 찾을 수 없습니다." };
  }

  revalidatePath("/");
  revalidatePath(`/groups/${eventId}`);

  return { success: true };
}
