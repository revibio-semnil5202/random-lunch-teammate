"use server";

import { db } from "@/db";
import { members, groups, groupMembers } from "@/db/schema";

/**
 * 전체 멤버를 랜덤으로 섞어 그룹으로 나누고 DB에 저장합니다.
 * @param groupSize 그룹당 인원 수 (기본값: 4)
 */
export async function createRandomMatch(groupSize: number = 4) {
  const allMembers = await db.select().from(members);

  if (allMembers.length < 2) {
    return { success: false, message: "매칭에 최소 2명 이상의 멤버가 필요합니다." };
  }

  // Fisher-Yates 셔플
  const shuffled = [...allMembers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 그룹 나누기
  const chunks: (typeof allMembers)[] = [];
  for (let i = 0; i < shuffled.length; i += groupSize) {
    chunks.push(shuffled.slice(i, i + groupSize));
  }

  // 마지막 그룹이 1명이면 이전 그룹에 합치기
  if (chunks.length > 1 && chunks[chunks.length - 1].length === 1) {
    const lastPerson = chunks.pop()![0];
    chunks[chunks.length - 1].push(lastPerson);
  }

  // DB 저장
  const results = [];
  for (const chunk of chunks) {
    const [group] = await db.insert(groups).values({}).returning();
    await db.insert(groupMembers).values(
      chunk.map((member) => ({
        groupId: group.id,
        memberId: member.id,
      }))
    );
    results.push({ groupId: group.id, members: chunk });
  }

  return { success: true, groups: results };
}
