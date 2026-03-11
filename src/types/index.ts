export interface Participant {
  id: string;
  team: string;
  name: string;
  createdAt: string;
}

export interface MatchGroup {
  groupIndex: number;
  members: Participant[];
}

export type GroupType = "company" | "team";

export const DAYS_OF_WEEK = ["월", "화", "수", "목", "금"] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export interface GroupConfig {
  id: string;
  title: string;
  groupType: GroupType;
  schedule: DayOfWeek[]; // 주차별 요일 로테이션. ["수"] = 매주 수, ["수","목"] = 수→목→수→목 반복
  maxParticipants: number;
  matchDeadlineTime: string;
  slackChannelUrl?: string;
  slackWebhookUrl?: string;
  maxRounds?: number;
  createdAt: string;
}

export interface Group {
  id: string;
  title: string;
  groupType: GroupType;
  lunchDate: string;
  lunchDateDisplay: string;
  matchDeadlineDisplay: string;
  participantCount: number;
  participants: Participant[];
  status: "recruiting" | "matched" | "cancelled";
  matchDeadline: string;
  matchResult?: MatchGroup[];
  slackChannelUrl?: string;
}
