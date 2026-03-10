import type { GroupConfig } from "@/types";

export const mockGroupConfigs: GroupConfig[] = [
  {
    id: "gc1",
    title: "리비바이오&알렌의서재",
    schedule: ["수"],
    maxParticipants: 12,
    matchDeadlineTime: "11:00",
    slackChannelUrl: "https://slack.com/app_redirect?channel=C0000000001",
    createdAt: "2026-01-15T09:00:00",
  },
  {
    id: "gc2",
    title: "스시히로바&맛있는녀석들",
    schedule: ["수", "목"],
    maxParticipants: 8,
    matchDeadlineTime: "11:00",
    slackChannelUrl: "https://slack.com/app_redirect?channel=C0000000002",
    createdAt: "2026-02-01T09:00:00",
  },
  {
    id: "gc3",
    title: "봉추찜닭&할매국수",
    schedule: ["화", "목", "금"],
    maxParticipants: 16,
    matchDeadlineTime: "11:30",
    createdAt: "2026-02-10T09:00:00",
  },
];
