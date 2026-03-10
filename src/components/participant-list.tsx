"use client";

import { Badge } from "@/components/ui/badge";
import { ParticipantItem } from "@/components/participant-item";
import type { Participant } from "@/types";

interface ParticipantListProps {
  participants: Participant[];
  onDeleteClick: (participant: Participant) => void;
}

export function ParticipantList({
  participants,
  onDeleteClick,
}: ParticipantListProps) {
  const grouped = participants.reduce<Record<string, Participant[]>>(
    (acc, p) => {
      if (!acc[p.team]) acc[p.team] = [];
      acc[p.team].push(p);
      return acc;
    },
    {}
  );

  const teams = Object.keys(grouped).sort();

  if (participants.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        아직 참여자가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">참여자 목록</h2>
        <Badge variant="secondary">{participants.length}명</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
        {teams.map((team) => (
          <div key={team} className="min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-muted-foreground">
                {team}
              </span>
              <Badge variant="outline" className="text-xs">
                {grouped[team].length}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              {grouped[team].map((participant) => (
                <ParticipantItem
                  key={participant.id}
                  participant={participant}
                  onDelete={onDeleteClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
