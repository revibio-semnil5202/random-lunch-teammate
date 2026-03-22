"use client";

import { Badge } from "@/components/ui/badge";
import { ParticipantItem } from "@/components/participant-item";
import { Users } from "lucide-react";
import type { Participant, GroupType } from "@/types";

interface ParticipantListProps {
  groupType?: GroupType;
  participants: Participant[];
  onDeleteClick: (participant: Participant) => void;
}

export function ParticipantList({
  groupType = "company",
  participants,
  onDeleteClick,
}: ParticipantListProps) {
  const isTeamType = groupType === "team";
  const grouped = participants.reduce<Record<string, Participant[]>>(
    (acc, p) => {
      if (!acc[p.team]) acc[p.team] = [];
      acc[p.team].push(p);
      return acc;
    },
    {},
  );

  const teams = Object.keys(grouped).sort();

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm">아직 참여자가 없습니다.</p>
        <p className="text-xs mt-1">
          {isTeamType
            ? "위에서 이름을 입력하여 등록해주세요."
            : "위에서 소속 팀과 이름을 입력하여 등록해주세요."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">참여자 목록</h2>
        <Badge className="bg-primary/10 text-primary border-0 font-semibold">
          {participants.filter((p) => !p.cancelledAt).length}명
        </Badge>
      </div>

      {isTeamType ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full">
          {participants.map((participant) => (
            <ParticipantItem
              key={participant.id}
              participant={participant}
              onDelete={onDeleteClick}
              showTeam={false}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 w-full">
          {teams.map((team) => (
            <div key={team} className="min-w-0">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b">
                <span className="text-sm font-bold text-foreground">
                  {team}
                </span>
                <Badge variant="outline" className="text-xs h-5 px-1.5">
                  {grouped[team].length}
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5">
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
      )}
    </div>
  );
}
