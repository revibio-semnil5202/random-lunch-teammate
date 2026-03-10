import type { Group } from "@/types";

export const mockGroups: Group[] = [
  {
    id: "g1",
    title: "리비바이오&알렌의서재",
    lunchDate: "2026-03-11",
    lunchDateDisplay: "03.11.수",
    matchDeadlineDisplay: "03.11.수 11:00",
    participantCount: 8,
    status: "matched",
    matchDeadline: "2026-03-11T11:00:00",
    participants: [
      { id: "p1", team: "백엔드", name: "김민수", createdAt: "2026-03-10T09:00:00" },
      { id: "p2", team: "프론트", name: "이지은", createdAt: "2026-03-10T09:05:00" },
      { id: "p3", team: "기획", name: "박서연", createdAt: "2026-03-10T09:10:00" },
      { id: "p4", team: "마케팅", name: "최준혁", createdAt: "2026-03-10T09:15:00" },
      { id: "p5", team: "QA", name: "정하늘", createdAt: "2026-03-10T09:20:00" },
      { id: "p6", team: "인사", name: "강예린", createdAt: "2026-03-10T09:25:00" },
      { id: "p7", team: "광고", name: "윤도현", createdAt: "2026-03-10T09:30:00" },
      { id: "p8", team: "출판", name: "한소희", createdAt: "2026-03-10T09:35:00" },
    ],
    slackChannelUrl: "https://slack.com/app_redirect?channel=C0000000001",
    matchResult: [
      {
        groupIndex: 1,
        members: [
          { id: "p1", team: "백엔드", name: "김민수", createdAt: "2026-03-10T09:00:00" },
          { id: "p3", team: "기획", name: "박서연", createdAt: "2026-03-10T09:10:00" },
          { id: "p6", team: "인사", name: "강예린", createdAt: "2026-03-10T09:25:00" },
          { id: "p7", team: "광고", name: "윤도현", createdAt: "2026-03-10T09:30:00" },
        ],
      },
      {
        groupIndex: 2,
        members: [
          { id: "p2", team: "프론트", name: "이지은", createdAt: "2026-03-10T09:05:00" },
          { id: "p4", team: "마케팅", name: "최준혁", createdAt: "2026-03-10T09:15:00" },
          { id: "p5", team: "QA", name: "정하늘", createdAt: "2026-03-10T09:20:00" },
          { id: "p8", team: "출판", name: "한소희", createdAt: "2026-03-10T09:35:00" },
        ],
      },
    ],
  },
  {
    id: "g2",
    title: "링커리어",
    lunchDate: "2026-03-12",
    lunchDateDisplay: "03.12.목",
    matchDeadlineDisplay: "03.12.목 11:00",
    participantCount: 6,
    status: "recruiting",
    matchDeadline: "2026-03-12T11:00:00",
    participants: [
      { id: "p9", team: "총무", name: "송민호", createdAt: "2026-03-10T10:00:00" },
      { id: "p10", team: "iOS", name: "오세훈", createdAt: "2026-03-10T10:05:00" },
      { id: "p11", team: "기획", name: "임수정", createdAt: "2026-03-10T10:10:00" },
      { id: "p12", team: "마케팅", name: "배수지", createdAt: "2026-03-10T10:15:00" },
      { id: "p13", team: "QA", name: "조인성", createdAt: "2026-03-10T10:20:00" },
      { id: "p14", team: "광고", name: "류승룡", createdAt: "2026-03-10T10:25:00" },
    ],
  },
  {
    id: "g3",
    title: "리비바이오&알렌의서재",
    lunchDate: "2026-03-13",
    lunchDateDisplay: "03.13.금",
    matchDeadlineDisplay: "03.13.금 11:00",
    participantCount: 1,
    status: "cancelled",
    matchDeadline: "2026-03-13T11:00:00",
    participants: [
      { id: "p15", team: "기획", name: "박서연", createdAt: "2026-03-12T09:00:00" },
    ],
  },
];

export const mockPastGroups: Group[] = [
  {
    id: "past-1",
    title: "리비바이오&알렌의서재",
    lunchDate: "2026-03-04",
    lunchDateDisplay: "03.04.수",
    matchDeadlineDisplay: "03.04.수 11:00",
    participantCount: 8,
    status: "matched",
    matchDeadline: "2026-03-04T11:00:00",
    slackChannelUrl: "https://slack.com/app_redirect?channel=C0000000002",
    participants: [
      { id: "h1", team: "백엔드", name: "김민수", createdAt: "2026-03-03T09:00:00" },
      { id: "h2", team: "프론트", name: "이지은", createdAt: "2026-03-03T09:05:00" },
      { id: "h3", team: "기획", name: "박서연", createdAt: "2026-03-03T09:10:00" },
      { id: "h4", team: "마케팅", name: "최준혁", createdAt: "2026-03-03T09:15:00" },
      { id: "h5", team: "QA", name: "정하늘", createdAt: "2026-03-03T09:20:00" },
      { id: "h6", team: "인사", name: "강예린", createdAt: "2026-03-03T09:25:00" },
      { id: "h7", team: "디자인", name: "윤도현", createdAt: "2026-03-03T09:30:00" },
      { id: "h8", team: "출판", name: "한소희", createdAt: "2026-03-03T09:35:00" },
    ],
    matchResult: [
      {
        groupIndex: 1,
        members: [
          { id: "h1", team: "백엔드", name: "김민수", createdAt: "2026-03-03T09:00:00" },
          { id: "h4", team: "마케팅", name: "최준혁", createdAt: "2026-03-03T09:15:00" },
          { id: "h5", team: "QA", name: "정하늘", createdAt: "2026-03-03T09:20:00" },
          { id: "h8", team: "출판", name: "한소희", createdAt: "2026-03-03T09:35:00" },
        ],
      },
      {
        groupIndex: 2,
        members: [
          { id: "h2", team: "프론트", name: "이지은", createdAt: "2026-03-03T09:05:00" },
          { id: "h3", team: "기획", name: "박서연", createdAt: "2026-03-03T09:10:00" },
          { id: "h6", team: "인사", name: "강예린", createdAt: "2026-03-03T09:25:00" },
          { id: "h7", team: "디자인", name: "윤도현", createdAt: "2026-03-03T09:30:00" },
        ],
      },
    ],
  },
  {
    id: "past-2",
    title: "링커리어",
    lunchDate: "2026-03-05",
    lunchDateDisplay: "03.05.목",
    matchDeadlineDisplay: "03.05.목 11:00",
    participantCount: 6,
    status: "matched",
    matchDeadline: "2026-03-05T11:00:00",
    slackChannelUrl: "https://slack.com/app_redirect?channel=C0000000003",
    participants: [
      { id: "h9", team: "총무", name: "송민호", createdAt: "2026-03-04T10:00:00" },
      { id: "h10", team: "iOS", name: "오세훈", createdAt: "2026-03-04T10:05:00" },
      { id: "h11", team: "기획", name: "임수정", createdAt: "2026-03-04T10:10:00" },
      { id: "h12", team: "마케팅", name: "배수지", createdAt: "2026-03-04T10:15:00" },
      { id: "h13", team: "QA", name: "조인성", createdAt: "2026-03-04T10:20:00" },
      { id: "h14", team: "광고", name: "류승룡", createdAt: "2026-03-04T10:25:00" },
    ],
    matchResult: [
      {
        groupIndex: 1,
        members: [
          { id: "h9", team: "총무", name: "송민호", createdAt: "2026-03-04T10:00:00" },
          { id: "h12", team: "마케팅", name: "배수지", createdAt: "2026-03-04T10:15:00" },
          { id: "h14", team: "광고", name: "류승룡", createdAt: "2026-03-04T10:25:00" },
        ],
      },
      {
        groupIndex: 2,
        members: [
          { id: "h10", team: "iOS", name: "오세훈", createdAt: "2026-03-04T10:05:00" },
          { id: "h11", team: "기획", name: "임수정", createdAt: "2026-03-04T10:10:00" },
          { id: "h13", team: "QA", name: "조인성", createdAt: "2026-03-04T10:20:00" },
        ],
      },
    ],
  },
];
