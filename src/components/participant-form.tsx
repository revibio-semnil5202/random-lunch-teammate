"use client";

import { useState, useRef, useEffect } from "react";
import { TEAMS } from "@/constants/teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UserPlus, Pencil, Check, X } from "lucide-react";
import type { GroupType } from "@/types";

interface ParticipantFormProps {
  groupType?: GroupType;
  selectedTeam: string;
  onTeamChange: (team: string) => void;
  nameInput: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  isDisabled: boolean;
  isDuplicate?: boolean;
}

export function ParticipantForm({
  groupType = "company",
  selectedTeam,
  onTeamChange,
  nameInput,
  onNameChange,
  onSubmit,
  isDisabled,
  isDuplicate,
}: ParticipantFormProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTeam, setCustomTeam] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCustomMode) {
      customInputRef.current?.focus();
    }
  }, [isCustomMode]);

  const handleCustomToggle = () => {
    setIsCustomMode(true);
    setCustomTeam("");
  };

  const handleCustomConfirm = () => {
    const trimmed = customTeam.trim();
    if (!trimmed) return;
    onTeamChange(trimmed);
    setIsCustomMode(false);
  };

  const handleCustomCancel = () => {
    setIsCustomMode(false);
    setCustomTeam("");
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomConfirm();
    } else if (e.key === "Escape") {
      handleCustomCancel();
    }
  };

  const isCustomSelected =
    selectedTeam !== "" && !TEAMS.includes(selectedTeam as (typeof TEAMS)[number]);

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      {/* 소속 팀 선택 */}
      {groupType !== "team" && <div className="space-y-3">
        <Label className="text-sm font-semibold">소속 팀</Label>
        <div className="flex flex-wrap gap-2">
          {TEAMS.map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => {
                onTeamChange(team);
                setIsCustomMode(false);
              }}
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

          {/* 직접 입력 버튼 / 입력 모드 */}
          {isCustomMode ? (
            <div className="flex items-center gap-1.5">
              <Input
                ref={customInputRef}
                value={customTeam}
                onChange={(e) => setCustomTeam(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                placeholder="팀 이름 입력"
                maxLength={10}
                className="h-[42px] w-32 text-sm"
              />
              <button
                type="button"
                onClick={handleCustomConfirm}
                disabled={!customTeam.trim()}
                className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCustomCancel}
                className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-all hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCustomToggle}
              className={cn(
                "cursor-pointer rounded-lg border border-dashed px-3 py-2.5 text-sm font-medium transition-all inline-flex items-center gap-1.5",
                isCustomSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/30"
              )}
            >
              <Pencil className="h-3.5 w-3.5" />
              {isCustomSelected ? selectedTeam : "직접 입력"}
            </button>
          )}
        </div>
      </div>}

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
          className="max-w-sm text-base h-10"
        />
      </div>

      {/* 에러 + 등록 버튼 */}
      {isDuplicate && (
        <p className="text-sm text-destructive text-center">
          {groupType === "team" ? "이미 동일한 이름으로 등록된 참여자가 있습니다." : "이미 동일한 팀/이름으로 등록된 참여자가 있습니다."}
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
