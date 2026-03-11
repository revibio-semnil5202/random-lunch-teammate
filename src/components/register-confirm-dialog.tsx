"use client";

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
import type { GroupType } from "@/types";

interface RegisterConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupType?: GroupType;
  team: string;
  name: string;
  groupTitle: string;
  lunchDateDisplay: string;
  isLoading: boolean;
  onConfirm: () => void;
  error?: string | null;
}

export function RegisterConfirmDialog({
  open,
  onOpenChange,
  groupType = "company",
  team,
  name,
  groupTitle,
  lunchDateDisplay,
  isLoading,
  onConfirm,
  error,
}: RegisterConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>참여 확인</DialogTitle>
          <DialogDescription className="flex flex-col gap-1 mt-2">
            <span className="font-bold text-foreground">{groupType === "team" ? name : `${team}/${name}`}</span>
            <span>{lunchDateDisplay} {groupTitle} 랜덤 팀점에 참여하시겠습니까?</span>
          </DialogDescription>
        </DialogHeader>
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
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
