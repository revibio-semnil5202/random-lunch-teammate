"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowLeft, AlarmClock } from "lucide-react";
import Link from "next/link";
import { ParticipantForm } from "@/components/participant-form";
import { ParticipantList } from "@/components/participant-list";
import { RegisterConfirmDialog } from "@/components/register-confirm-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { registerParticipant, deleteParticipant } from "@/actions/participants";
import type { Group, Participant } from "@/types";

interface GroupDetailProps {
  group: Group;
}

export function GroupDetail({ group }: GroupDetailProps) {
  const router = useRouter();

  const [selectedTeam, setSelectedTeam] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [targetDeleteParticipant, setTargetDeleteParticipant] =
    useState<Participant | null>(null);

  const isDuplicate = group.participants.some(
    (p) => p.team === selectedTeam && p.name === nameInput.trim(),
  );

  const isTeamType = group.groupType === "team";

  const handleRegisterClick = () => {
    if ((!isTeamType && !selectedTeam) || !nameInput.trim()) return;
    setRegisterError(null);
    setIsRegisterModalOpen(true);
  };

  const handleRegisterConfirm = async () => {
    setIsRegisterLoading(true);
    setRegisterError(null);

    const result = await registerParticipant({
      eventId: group.id,
      team: selectedTeam,
      name: nameInput.trim(),
      groupType: group.groupType,
    });

    setIsRegisterLoading(false);

    if (!result.success) {
      setRegisterError(result.error);
      return;
    }

    setIsRegisterModalOpen(false);
    setSelectedTeam("");
    setNameInput("");
    router.refresh();
  };

  const handleDeleteClick = (participant: Participant) => {
    setTargetDeleteParticipant(participant);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (cancelReason: string) => {
    if (!targetDeleteParticipant) return;
    setIsDeleteLoading(true);
    setDeleteError(null);

    const result = await deleteParticipant({
      eventId: group.id,
      participantId: targetDeleteParticipant.id,
      cancelReason,
    });

    setIsDeleteLoading(false);

    if (!result.success) {
      setDeleteError(result.error ?? "삭제에 실패했습니다.");
      return;
    }

    setIsDeleteModalOpen(false);
    setTargetDeleteParticipant(null);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* 헤더 영역 */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          대시보드
        </Link>

        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
          <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-2xl font-bold">{group.title}</h1>
            {group.registrationType === "preset" && (
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                사전등록
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold">
                {group.participants.length}명 참여
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {group.lunchDateDisplay} 점심
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <AlarmClock className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {group.matchDeadlineDisplay} 모집 마감
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 등록 폼 영역 */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-1">참여자 등록</h2>
        {group.registrationType === "preset" && (
          <p className="text-xs text-muted-foreground mb-4">
            사전등록된 참가자 외에 추가로 등록할 수 있습니다.
          </p>
        )}
        {group.registrationType !== "preset" && <div className="mb-4" />}
        <ParticipantForm
          groupType={group.groupType}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          nameInput={nameInput}
          onNameChange={setNameInput}
          onSubmit={handleRegisterClick}
          isDisabled={
            (!isTeamType && !selectedTeam) || !nameInput.trim() || isDuplicate
          }
          isDuplicate={isDuplicate}
        />
      </div>

      {/* 참여자 목록 영역 */}
      <div className="rounded-2xl border bg-card p-6">
        <ParticipantList
          groupType={group.groupType}
          participants={group.participants}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      <RegisterConfirmDialog
        open={isRegisterModalOpen}
        onOpenChange={(open) => {
          setIsRegisterModalOpen(open);
          if (!open) setRegisterError(null);
        }}
        groupType={group.groupType}
        team={selectedTeam}
        name={nameInput}
        groupTitle={group.title}
        lunchDateDisplay={group.lunchDateDisplay}
        isLoading={isRegisterLoading}
        onConfirm={handleRegisterConfirm}
        error={registerError}
      />

      <DeleteConfirmDialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setDeleteError(null);
        }}
        groupType={group.groupType}
        participant={targetDeleteParticipant}
        isLoading={isDeleteLoading}
        onConfirm={handleDeleteConfirm}
        error={deleteError}
      />
    </div>
  );
}
