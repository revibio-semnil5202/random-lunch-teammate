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
    <div className="group relative rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent">
      <span className="font-medium text-primary">{participant.team}</span>
      <span className="mx-1 text-muted-foreground">/</span>
      <span>{participant.name}</span>
      <button
        type="button"
        onClick={() => onDelete(participant)}
        aria-label={`${participant.team} ${participant.name} 삭제`}
        className="absolute -right-1 -top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
