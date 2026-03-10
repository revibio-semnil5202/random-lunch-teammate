export const TEAMS = [
  "기획",
  "마케팅",
  "광고",
  "출판",
  "디자인",
  "백엔드",
  "프론트",
  "iOS",
  "Android",
  "플러터",
  "QA",
  "인사",
  "총무",
  "데이터",
] as const;

export type Team = (typeof TEAMS)[number];
