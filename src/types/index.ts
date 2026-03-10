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

export interface Group {
  id: string;
  title: string;
  lunchDate: string;
  lunchDateDisplay: string;
  participantCount: number;
  participants: Participant[];
  status: "recruiting" | "matched";
  matchDeadline: string;
  matchResult?: MatchGroup[];
}
