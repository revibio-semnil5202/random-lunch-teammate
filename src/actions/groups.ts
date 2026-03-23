"use server";

import { db } from "@/db";
import {
  lunchEvents,
  groupConfigs,
  eventParticipants,
  members,
  matchResults,
} from "@/db/schema";
import { eq, and, gte, lt, lte, desc } from "drizzle-orm";
import type {
  Group,
  GroupType,
  RegistrationType,
  Participant,
  MatchGroup,
} from "@/types";

const KOREAN_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function formatLunchDateDisplay(dateStr: string): string {
  // dateStr is "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dayName = KOREAN_DAYS[d.getDay()];
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${mm}.${dd}.${dayName}`;
}

function formatDeadlineDisplay(deadline: Date): string {
  const kst = new Date(deadline.getTime() + 9 * 60 * 60 * 1000);
  const month = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");
  const dayName = KOREAN_DAYS[kst.getUTCDay()];
  const hours = String(kst.getUTCHours()).padStart(2, "0");
  const minutes = String(kst.getUTCMinutes()).padStart(2, "0");
  return `${month}.${day}.${dayName} ${hours}:${minutes}`;
}

function getWeekBounds(): { monday: Date; nextMonday: Date } {
  // KST 기준으로 이번 주 월요일~다음 주 월요일 계산
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000); // KST
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const mondayDate = now.getUTCDate() + diffToMonday;
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), mondayDate),
  );
  const nextMonday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), mondayDate + 7),
  );

  return { monday, nextMonday };
}

function toDateString(d: Date): string {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function fetchParticipants(eventId: number): Promise<Participant[]> {
  const rows = await db
    .select({
      memberId: members.id,
      name: members.name,
      department: members.department,
      isPreset: eventParticipants.isPreset,
      createdAt: eventParticipants.createdAt,
      cancelledAt: eventParticipants.cancelledAt,
      cancelReason: eventParticipants.cancelReason,
    })
    .from(eventParticipants)
    .innerJoin(members, eq(eventParticipants.memberId, members.id))
    .where(eq(eventParticipants.eventId, eventId));

  return rows.map((r) => ({
    id: r.memberId.toString(),
    team: r.department ?? "",
    name: r.name,
    createdAt: r.createdAt.toISOString(),
    isPreset: r.isPreset ?? false,
    cancelledAt: r.cancelledAt?.toISOString(),
    cancelReason: r.cancelReason ?? undefined,
  }));
}

async function fetchMatchResult(eventId: number): Promise<MatchGroup[]> {
  const rows = await db
    .select({
      matchGroupIndex: matchResults.matchGroupIndex,
      memberId: members.id,
      name: members.name,
      department: members.department,
      createdAt: matchResults.createdAt,
    })
    .from(matchResults)
    .innerJoin(members, eq(matchResults.memberId, members.id))
    .where(eq(matchResults.eventId, eventId))
    .orderBy(matchResults.matchGroupIndex);

  const groupMap = new Map<number, Participant[]>();
  for (const row of rows) {
    if (!groupMap.has(row.matchGroupIndex)) {
      groupMap.set(row.matchGroupIndex, []);
    }
    groupMap.get(row.matchGroupIndex)!.push({
      id: row.memberId.toString(),
      team: row.department ?? "",
      name: row.name,
      createdAt: row.createdAt.toISOString(),
    });
  }

  return Array.from(groupMap.entries()).map(([groupIndex, members]) => ({
    groupIndex,
    members,
  }));
}

async function buildGroup(
  event: {
    id: number;
    groupConfigId: number;
    lunchDate: string;
    matchDeadline: Date;
    status: string;
    createdAt: Date;
  },
  config: {
    title: string;
    groupType: string;
    registrationType: string;
    slackChannelUrl: string | null;
  },
): Promise<Group> {
  const participants = await fetchParticipants(event.id);
  const isMatched = event.status === "matched";
  const matchResult = isMatched ? await fetchMatchResult(event.id) : undefined;

  return {
    id: event.id.toString(),
    title: config.title,
    groupType: (config.groupType as GroupType) ?? "company",
    registrationType: (config.registrationType as RegistrationType) ?? "self",
    lunchDate: event.lunchDate,
    lunchDateDisplay: formatLunchDateDisplay(event.lunchDate),
    matchDeadlineDisplay: formatDeadlineDisplay(event.matchDeadline),
    participantCount: participants.filter((p) => !p.cancelledAt).length,
    participants,
    status: isMatched ? "matched" : "recruiting",
    matchDeadline: event.matchDeadline.toISOString(),
    matchResult,
    slackChannelUrl: config.slackChannelUrl ?? undefined,
  };
}

export async function getGroups(): Promise<{
  active: Group[];
  past: Group[];
}> {
  const { monday, nextMonday } = getWeekBounds();
  const mondayStr = toDateString(monday);
  const nextMondayStr = toDateString(nextMonday);

  const [activeRows, pastRows] = await Promise.all([
    db
      .select({
        id: lunchEvents.id,
        groupConfigId: lunchEvents.groupConfigId,
        lunchDate: lunchEvents.lunchDate,
        matchDeadline: lunchEvents.matchDeadline,
        status: lunchEvents.status,
        createdAt: lunchEvents.createdAt,
        title: groupConfigs.title,
        groupType: groupConfigs.groupType,
        registrationType: groupConfigs.registrationType,
        slackChannelUrl: groupConfigs.slackChannelUrl,
      })
      .from(lunchEvents)
      .innerJoin(groupConfigs, eq(lunchEvents.groupConfigId, groupConfigs.id))
      .where(
        and(
          gte(lunchEvents.lunchDate, mondayStr),
          lt(lunchEvents.lunchDate, nextMondayStr),
        ),
      ),
    db
      .select({
        id: lunchEvents.id,
        groupConfigId: lunchEvents.groupConfigId,
        lunchDate: lunchEvents.lunchDate,
        matchDeadline: lunchEvents.matchDeadline,
        status: lunchEvents.status,
        createdAt: lunchEvents.createdAt,
        title: groupConfigs.title,
        groupType: groupConfigs.groupType,
        registrationType: groupConfigs.registrationType,
        slackChannelUrl: groupConfigs.slackChannelUrl,
      })
      .from(lunchEvents)
      .innerJoin(groupConfigs, eq(lunchEvents.groupConfigId, groupConfigs.id))
      .where(
        and(
          lt(lunchEvents.lunchDate, mondayStr),
          eq(lunchEvents.status, "matched"),
        ),
      )
      .orderBy(desc(lunchEvents.lunchDate))
      .limit(20),
  ]);

  const [active, past] = await Promise.all([
    Promise.all(
      activeRows.map((row) =>
        buildGroup(row, {
          title: row.title,
          groupType: row.groupType,
          registrationType: row.registrationType,
          slackChannelUrl: row.slackChannelUrl,
        }),
      ),
    ),
    Promise.all(
      pastRows.map((row) =>
        buildGroup(row, {
          title: row.title,
          groupType: row.groupType,
          registrationType: row.registrationType,
          slackChannelUrl: row.slackChannelUrl,
        }),
      ),
    ),
  ]);

  return { active, past };
}

export async function getGroupDetail(eventId: string): Promise<Group | null> {
  const rows = await db
    .select({
      id: lunchEvents.id,
      groupConfigId: lunchEvents.groupConfigId,
      lunchDate: lunchEvents.lunchDate,
      matchDeadline: lunchEvents.matchDeadline,
      status: lunchEvents.status,
      createdAt: lunchEvents.createdAt,
      title: groupConfigs.title,
      groupType: groupConfigs.groupType,
      registrationType: groupConfigs.registrationType,
      slackChannelUrl: groupConfigs.slackChannelUrl,
    })
    .from(lunchEvents)
    .innerJoin(groupConfigs, eq(lunchEvents.groupConfigId, groupConfigs.id))
    .where(eq(lunchEvents.id, parseInt(eventId, 10)))
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];
  return buildGroup(row, {
    title: row.title,
    groupType: row.groupType,
    registrationType: row.registrationType,
    slackChannelUrl: row.slackChannelUrl,
  });
}
