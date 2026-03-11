"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import type { Participant } from "@/types";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant | null;
  isLoading: boolean;
  onConfirm: () => void;
  error?: string | null;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  participant,
  isLoading,
  onConfirm,
  error,
}: DeleteConfirmDialogProps) {
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    if (!open) setNameInput("");
  }, [open]);

  if (!participant) return null;

  const isNameMatch = nameInput.trim() === participant.name;

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>참여자 삭제</DialogTitle>
          <DialogDescription className="flex flex-col gap-1 mt-2">
            <span>
              <span className="font-bold text-foreground">{participant.team}/{participant.name}</span>
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
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
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
            onClick={onConfirm}
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
