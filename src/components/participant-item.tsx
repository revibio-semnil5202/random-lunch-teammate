"use client";

import { X } from "lucide-react";
import type { Participant } from "@/types";

interface ParticipantItemProps {
  participant: Participant;
  onDelete: (participant: Participant) => void;
}

export function ParticipantItem({
  participant,
  onDelete,
}: ParticipantItemProps) {
  return (
    <div className="group relative flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm transition-all hover:bg-accent hover:shadow-sm">
      <span className="inline-flex items-center justify-center rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
        {participant.team}
      </span>
      <span className="font-medium truncate">{participant.name}</span>
      <button
        type="button"
        onClick={() => onDelete(participant)}
        aria-label={`${participant.team} ${participant.name} 삭제`}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
