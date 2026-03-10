"use server";

import { db } from "@/db";
import { members, groups, groupMembers } from "@/db/schema";
import { createMatch } from "@/lib/match";

/**
 * 전체 멤버를 랜덤으로 섞어 그룹으로 나누고 DB에 저장합니다.
 * @param maxGroupSize 그룹당 최대 인원 수 (기본값: 4, 최대: 12)
 */
export async function createRandomMatch(maxGroupSize: number = 4) {
  const allMembers = await db.select().from(members);

  const result = createMatch(allMembers, { maxGroupSize });

  if (!result.success || !result.groups) {
    return { success: false, message: result.message };
  }

  // DB 저장
  const savedGroups = [];
  for (const chunk of result.groups) {
    const [group] = await db.insert(groups).values({}).returning();
    await db.insert(groupMembers).values(
      chunk.map((member) => ({
        groupId: group.id,
        memberId: member.id,
      }))
    );
    savedGroups.push({ groupId: group.id, members: chunk });
  }

  return { success: true, groups: savedGroups };
}
