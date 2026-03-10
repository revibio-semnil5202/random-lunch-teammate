export const TEAMS = [
  "기획",
  "마케팅",
  "광고",
  "출판",
  "백엔드",
  "프론트",
  "iOS",
  "Android",
  "플러터",
  "디자인",
  "인사",
  "총무",
  "QA",
] as const;

export type Team = (typeof TEAMS)[number];
