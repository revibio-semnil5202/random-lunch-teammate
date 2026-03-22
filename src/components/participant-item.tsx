"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Participant } from "@/types";

interface ParticipantItemProps {
  participant: Participant;
  onDelete: (participant: Participant) => void;
  showTeam?: boolean;
}

export function ParticipantItem({
  participant,
  onDelete,
  showTeam = true,
}: ParticipantItemProps) {
  const isCancelled = !!participant.cancelledAt;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm transition-all",
        isCancelled ? "opacity-50" : "hover:bg-accent hover:shadow-sm",
      )}
    >
      {showTeam && (
        <span className="inline-flex items-center justify-center rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
          {participant.team}
        </span>
      )}
      <span className="font-medium truncate">{participant.name}</span>

      {isCancelled ? (
        <span className="ml-auto shrink-0 inline-flex items-center rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-medium text-rose-600">
          {participant.cancelReason || "미참"}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onDelete(participant)}
          aria-label={`${showTeam ? `${participant.team} ` : ""}${participant.name} 삭제`}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-rose-400 text-white shadow-sm"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
