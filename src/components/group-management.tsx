"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Calendar, Clock, Users, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GroupConfigForm } from "@/components/group-config-form";
import {
  createGroupConfig,
  updateGroupConfig,
  deleteGroupConfig,
} from "@/actions/admin";
import type { GroupConfig } from "@/types";

interface GroupManagementProps {
  initialConfigs: GroupConfig[];
}

export function GroupManagement({ initialConfigs }: GroupManagementProps) {
  const router = useRouter();
  const configs = initialConfigs;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GroupConfig | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GroupConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAdd = async (data: Omit<GroupConfig, "id" | "createdAt">) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await createGroupConfig(data);
      setIsFormOpen(false);
      router.refresh();
    } catch {
      setActionError("그룹 추가에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: Omit<GroupConfig, "id" | "createdAt">) => {
    if (!editTarget) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      await updateGroupConfig(editTarget.id, data);
      setEditTarget(null);
      router.refresh();
    } catch {
      setActionError("그룹 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const result = await deleteGroupConfig(deleteTarget.id);
      if (!result.success) {
        setActionError(result.error ?? "그룹 삭제에 실패했습니다.");
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    } catch {
      setActionError("그룹 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSchedule = (config: GroupConfig) => {
    if (config.schedule.length === 1) {
      return `매주 ${config.schedule[0]}요일`;
    }
    return config.schedule.map((d) => `${d}`).join(" → ") + " 반복";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">그룹 관리</h1>
        <Button onClick={() => { setActionError(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-1.5" />
          그룹 추가
        </Button>
      </div>

      {/* 그룹 목록 */}
      {configs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            등록된 그룹이 없습니다
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => { setActionError(null); setIsFormOpen(true); }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            첫 그룹 만들기
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {configs.map((config) => (
            <div
              key={config.id}
              className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all hover:shadow-sm"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-xl" />

              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3 min-w-0">
                  <h3 className="font-bold text-base">{config.title}</h3>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Repeat className="h-3 w-3" />
                      {formatSchedule(config)}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      조별 {config.maxParticipants}명
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {config.matchDeadlineTime} 마감
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setActionError(null); setEditTarget(config); }}
                    className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActionError(null); setDeleteTarget(config); }}
                    className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 추가 다이얼로그 */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setActionError(null); }}>
        <DialogContent keepMounted>
          <DialogHeader>
            <DialogTitle>그룹 추가</DialogTitle>
          </DialogHeader>
          {actionError && isFormOpen && (
            <p className="text-sm text-destructive">{actionError}</p>
          )}
          <GroupConfigForm
            onSubmit={handleAdd}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* 수정 다이얼로그 */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) { setEditTarget(null); setActionError(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>그룹 수정</DialogTitle>
          </DialogHeader>
          {actionError && !!editTarget && (
            <p className="text-sm text-destructive">{actionError}</p>
          )}
          <GroupConfigForm
            key={editTarget?.id}
            config={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setActionError(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>그룹 삭제</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground flex flex-col gap-1">
              <span className="font-bold text-foreground">{deleteTarget?.title}</span>
              <span>삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</span>
            </p>
            {actionError && !!deleteTarget && (
              <p className="text-sm text-destructive">{actionError}</p>
            )}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1"
              >
                삭제
              </Button>
              <Button
                variant="outline"
                onClick={() => { setDeleteTarget(null); setActionError(null); }}
                disabled={isSubmitting}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
