"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Pencil, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Participant, GroupType } from "@/types";

const CANCEL_REASONS = ["개인사정", "휴가"] as const;

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupType?: GroupType;
  participant: Participant | null;
  isLoading: boolean;
  onConfirm: (cancelReason: string) => void;
  error?: string | null;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  groupType = "company",
  participant,
  isLoading,
  onConfirm,
  error,
}: DeleteConfirmDialogProps) {
  const [nameInput, setNameInput] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("개인사정");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setNameInput("");
      setSelectedReason("개인사정");
      setIsCustomMode(false);
      setCustomReason("");
    }
  }, [open]);

  useEffect(() => {
    if (isCustomMode) {
      customInputRef.current?.focus();
    }
  }, [isCustomMode]);

  if (!participant) return null;

  const isNameMatch = nameInput.trim() === participant.name;

  const isCustomSelected =
    selectedReason !== "" &&
    !CANCEL_REASONS.includes(selectedReason as (typeof CANCEL_REASONS)[number]);

  const handleCustomConfirm = () => {
    const trimmed = customReason.trim();
    if (!trimmed) return;
    setSelectedReason(trimmed);
    setIsCustomMode(false);
  };

  const handleCustomCancel = () => {
    setIsCustomMode(false);
    setCustomReason("");
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomConfirm();
    } else if (e.key === "Escape") {
      handleCustomCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>참여자 삭제</DialogTitle>
          <DialogDescription className="flex flex-col gap-1 mt-2">
            <span>
              <span className="font-bold text-foreground">
                {groupType === "team"
                  ? participant.name
                  : `${participant.team}/${participant.name}`}
              </span>
              을(를) 삭제하시겠습니까?
            </span>
            <span>본인 확인을 위해 이름을 입력해 주세요.</span>
          </DialogDescription>
        </DialogHeader>
        <Input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder={participant.name}
          className="text-base h-10"
          autoFocus
        />

        {/* 미참 사유 선택 */}
        <div className="space-y-2.5">
          <label className="text-sm font-semibold">미참 사유</label>
          <div className="flex flex-wrap gap-2">
            {CANCEL_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => {
                  setSelectedReason(reason);
                  setIsCustomMode(false);
                }}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                  selectedReason === reason && !isCustomSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/30",
                )}
              >
                {reason}
              </button>
            ))}

            {isCustomMode ? (
              <div className="flex items-center gap-1.5">
                <Input
                  ref={customInputRef}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  onKeyDown={handleCustomKeyDown}
                  placeholder="사유 입력"
                  maxLength={30}
                  className="h-[38px] w-36 text-sm"
                />
                <button
                  type="button"
                  onClick={handleCustomConfirm}
                  disabled={!customReason.trim()}
                  className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCustomCancel}
                  className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-all hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(true);
                  setCustomReason("");
                }}
                className={cn(
                  "cursor-pointer rounded-lg border border-dashed px-3 py-2 text-sm font-medium transition-all inline-flex items-center gap-1.5",
                  isCustomSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/30",
                )}
              >
                <Pencil className="h-3.5 w-3.5" />
                {isCustomSelected ? selectedReason : "직접 입력"}
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(selectedReason)}
            disabled={isLoading || !isNameMatch}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
