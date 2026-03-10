"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowLeft } from "lucide-react";
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
    (p) => p.team === selectedTeam && p.name === nameInput.trim()
  );

  const handleRegisterClick = () => {
    if (!selectedTeam || !nameInput.trim()) return;
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

  const handleDeleteConfirm = async () => {
    if (!targetDeleteParticipant) return;
    setIsDeleteLoading(true);
    setDeleteError(null);

    const result = await deleteParticipant({
      eventId: group.id,
      participantId: targetDeleteParticipant.id,
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
          <h1 className="text-2xl font-bold mb-3">{group.title}</h1>
          <div className="flex items-center gap-4">
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
                {group.lunchDateDisplay}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 등록 폼 영역 */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-5">참여 등록</h2>
        <ParticipantForm
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          nameInput={nameInput}
          onNameChange={setNameInput}
          onSubmit={handleRegisterClick}
          isDisabled={!selectedTeam || !nameInput.trim() || isDuplicate}
          isDuplicate={isDuplicate}
        />
      </div>

      {/* 참여자 목록 영역 */}
      <div className="rounded-2xl border bg-card p-6">
        <ParticipantList
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
        participant={targetDeleteParticipant}
        isLoading={isDeleteLoading}
        onConfirm={handleDeleteConfirm}
        error={deleteError}
      />
    </div>
  );
}
