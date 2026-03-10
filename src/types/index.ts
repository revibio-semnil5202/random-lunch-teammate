export interface Participant {
  id: string;
  team: string;
  name: string;
  createdAt: string;
}

export interface Group {
  id: string;
  title: string;
  lunchDate: string;
  lunchDateDisplay: string;
  participantCount: number;
  participants: Participant[];
}
