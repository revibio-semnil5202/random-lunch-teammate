export const TEAMS = [
  "기획팀",
  "마케팅팀",
  "광고팀",
  "출판팀",
  "개발팀",
  "디자인팀",
  "인사팀",
  "총무팀",
  "QA팀",
] as const;

export type Team = (typeof TEAMS)[number];
