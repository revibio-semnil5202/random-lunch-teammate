"use client";

import { useState } from "react";
import { X, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TEAMS } from "@/constants/teams";
import type { GroupType, PresetMember } from "@/types";

interface PresetMembersInputProps {
  groupType: GroupType;
  value: PresetMember[];
  onChange: (members: PresetMember[]) => void;
}

export function PresetMembersInput({
  groupType,
  value,
  onChange,
}: PresetMembersInputProps) {
  if (groupType === "team") {
    return (
      <TeamModeInput
        value={value.map((m) => m.name)}
        onChange={(names) => onChange(names.map((name) => ({ name })))}
      />
    );
  }

  return <CompanyModeInput value={value} onChange={onChange} />;
}

// ─── 팀 미구분 모드: 이름 Input 1개 + 아래 칩 나열 ───

function TeamModeInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (names: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);

  const addName = () => {
    const trimmed = input.trim();
    if (!trimmed || trimmed.length > 10) return;
    if (value.includes(trimmed)) {
      setDuplicateError(true);
      return;
    }
    setDuplicateError(false);
    onChange([...value, trimmed]);
    setInput("");
  };

  const removeName = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">사전등록 참가자</Label>
      <div className="rounded-xl border bg-muted/30 p-3 space-y-3">
        <div>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setDuplicateError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addName();
              }
            }}
            placeholder="이름 입력 후 Enter"
            maxLength={10}
            className="h-9 text-sm bg-background"
          />
          {duplicateError && (
            <p className="text-xs text-destructive mt-1">
              이미 등록된 이름입니다.
            </p>
          )}
        </div>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {value.map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded bg-secondary pl-2.5 pr-1 py-1 text-sm font-medium"
              >
                {name}
                <button
                  type="button"
                  onClick={() => removeName(i)}
                  className="ml-0.5 rounded p-0.5 hover:bg-foreground/10 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {value.length === 0 && (
          <p className="text-xs text-muted-foreground">
            사전등록할 참가자 이름을 입력하세요.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── 팀 구분 모드: 팀 pill 선택 + 이름 Input 1개 → 아래에 팀·이름 칩이 쌓임 ───

function CompanyModeInput({
  value,
  onChange,
}: {
  value: PresetMember[];
  onChange: (members: PresetMember[]) => void;
}) {
  const [selectedTeam, setSelectedTeam] = useState<string>(
    value.length > 0 ? (value[value.length - 1].department ?? "") : "",
  );
  const [nameInput, setNameInput] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTeam, setCustomTeam] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);

  const isCustomSelected =
    selectedTeam !== "" &&
    !TEAMS.includes(selectedTeam as (typeof TEAMS)[number]);

  const addMember = () => {
    const trimmed = nameInput.trim();
    if (!selectedTeam || !trimmed || trimmed.length > 10) return;
    const isDuplicate = value.some(
      (m) => m.department === selectedTeam && m.name === trimmed,
    );
    if (isDuplicate) {
      setDuplicateError(true);
      return;
    }
    setDuplicateError(false);
    onChange([...value, { name: trimmed, department: selectedTeam }]);
    setNameInput("");
  };

  const removeMember = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleCustomConfirm = () => {
    const trimmed = customTeam.trim();
    if (!trimmed) return;
    setSelectedTeam(trimmed);
    setIsCustomMode(false);
    setCustomTeam("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">사전등록 참가자</Label>
      <div className="rounded-xl border bg-muted/30 p-3 space-y-3">
        {/* 팀 선택 */}
        <div className="flex flex-wrap items-center gap-1.5">
          {TEAMS.map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => setSelectedTeam(team)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer",
                selectedTeam === team
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input hover:bg-accent",
              )}
            >
              {team}
            </button>
          ))}

          {/* 직접 입력 */}
          {isCustomMode ? (
            <div className="inline-flex items-center gap-1">
              <Input
                value={customTeam}
                onChange={(e) => setCustomTeam(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCustomConfirm();
                  }
                  if (e.key === "Escape") setIsCustomMode(false);
                }}
                placeholder="팀 이름"
                maxLength={10}
                className="h-7 w-24 text-xs"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCustomConfirm}
                disabled={!customTeam.trim()}
                className="rounded p-1 hover:bg-accent cursor-pointer disabled:opacity-50"
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="rounded p-1 hover:bg-accent cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isCustomSelected) {
                  setCustomTeam(selectedTeam);
                }
                setIsCustomMode(true);
              }}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium border border-dashed transition-colors cursor-pointer inline-flex items-center gap-1",
                isCustomSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input hover:bg-accent",
              )}
            >
              <Pencil className="h-3 w-3" />
              {isCustomSelected ? selectedTeam : "직접 입력"}
            </button>
          )}
        </div>

        {/* 이름 입력 */}
        <div>
          <Input
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setDuplicateError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addMember();
              }
            }}
            placeholder={
              selectedTeam
                ? `${selectedTeam} 팀 이름 입력 후 Enter`
                : "팀을 먼저 선택하세요"
            }
            disabled={!selectedTeam}
            maxLength={10}
            className="h-9 text-sm bg-background"
          />
          {duplicateError && (
            <p className="text-xs text-destructive mt-1">
              이미 동일한 팀/이름으로 등록된 참가자가 있습니다.
            </p>
          )}
        </div>

        {/* 등록된 참가자 칩 목록 */}
        {value.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              등록된 참가자 ({value.length}명)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {value.map((m, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded bg-secondary pl-1 pr-1 py-1 text-sm font-medium"
                >
                  <span className="inline-flex items-center justify-center rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                    {m.department}
                  </span>
                  {m.name}
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    className="ml-0.5 rounded p-0.5 hover:bg-foreground/10 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {value.length === 0 && (
          <p className="text-xs text-muted-foreground">
            팀을 선택하고 이름을 입력하여 참가자를 등록하세요.
          </p>
        )}
      </div>
    </div>
  );
}
