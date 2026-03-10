"use client";

import { TEAMS } from "@/constants/teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";

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
    <div className="mx-auto max-w-[800px] space-y-6">
      {/* 소속 팀 선택 */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">소속 팀</Label>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {TEAMS.map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => onTeamChange(team)}
              className={cn(
                "cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                selectedTeam === team
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/30"
              )}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      {/* 이름 입력 */}
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

      {/* 에러 + 등록 버튼 */}
      {isDuplicate && (
        <p className="text-sm text-destructive text-center">
          이미 동일한 팀/이름으로 등록된 참여자가 있습니다.
        </p>
      )}
      <div className="flex justify-center pt-2">
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
          size="lg"
          className="w-full max-w-sm h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          참가자 등록
        </Button>
      </div>
    </div>
  );
}
