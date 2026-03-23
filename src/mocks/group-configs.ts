import type { GroupConfig } from "@/types";

export const mockGroupConfigs: GroupConfig[] = [
  {
    id: "gc1",
    title: "리비바이오&알렌의서재",
    groupType: "company",
    registrationType: "self",
    schedule: ["수"],
    maxParticipants: 12,
    matchDeadlineTime: "11:00",
    slackChannelUrl: "https://slack.com/app_redirect?channel=C0000000001",
    createdAt: "2026-01-15T09:00:00",
  },
  {
    id: "gc2",
    title: "링커리어",
    groupType: "company",
    registrationType: "self",
    schedule: ["수", "목"],
    maxParticipants: 8,
    matchDeadlineTime: "11:00",
    slackChannelUrl: "https://slack.com/app_redirect?channel=C0000000003",
    createdAt: "2026-02-01T09:00:00",
  },
];
