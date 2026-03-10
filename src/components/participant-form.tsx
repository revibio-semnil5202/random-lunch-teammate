"use client";

import { TEAMS } from "@/constants/teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ParticipantFormProps {
  selectedTeam: string;
  onTeamChange: (team: string) => void;
  nameInput: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  isDisabled: boolean;
  isDuplicate?: boolean;
}

export function ParticipantForm({
  selectedTeam,
  onTeamChange,
  nameInput,
  onNameChange,
  onSubmit,
  isDisabled,
  isDuplicate,
}: ParticipantFormProps) {
  return (
    <div className="mx-auto max-w-[800px] space-y-5">
      <div className="space-y-3">
        <Label className="text-sm font-semibold">소속 팀</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {TEAMS.map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => onTeamChange(team)}
              className={cn(
                "cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                selectedTeam === team
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="name-input" className="text-sm font-semibold">
          이름
        </Label>
        <Input
          id="name-input"
          value={nameInput}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="이름을 입력하세요"
          maxLength={10}
          className="max-w-xs"
        />
      </div>

      {isDuplicate && (
        <p className="text-sm text-destructive">
          이미 동일한 팀/이름으로 등록된 참여자가 있습니다.
        </p>
      )}
      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
          size="lg"
          className="w-full max-w-xs text-base font-bold shadow-md hover:shadow-lg"
        >
          참가자 등록
        </Button>
      </div>
    </div>
  );
}
