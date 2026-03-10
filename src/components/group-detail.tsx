"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ParticipantForm } from "@/components/participant-form";
import { ParticipantList } from "@/components/participant-list";
import { RegisterConfirmDialog } from "@/components/register-confirm-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import type { Group, Participant } from "@/types";

interface GroupDetailProps {
  group: Group;
}

export function GroupDetail({ group }: GroupDetailProps) {
  const [participants, setParticipants] = useState<Participant[]>(
    group.participants
  );
  const [selectedTeam, setSelectedTeam] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [targetDeleteParticipant, setTargetDeleteParticipant] =
    useState<Participant | null>(null);

  const isDuplicate = participants.some(
    (p) => p.team === selectedTeam && p.name === nameInput.trim()
  );

  const handleRegisterClick = () => {
    if (!selectedTeam || !nameInput.trim()) return;
    setIsRegisterModalOpen(true);
  };

  const handleRegisterConfirm = async () => {
    setIsRegisterLoading(true);
    // Mock POST delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      team: selectedTeam,
      name: nameInput.trim(),
      createdAt: new Date().toISOString(),
    };

    setParticipants((prev) => [...prev, newParticipant]);
    setIsRegisterLoading(false);
    setIsRegisterModalOpen(false);
    setSelectedTeam("");
    setNameInput("");
  };

  const handleDeleteClick = (participant: Participant) => {
    setTargetDeleteParticipant(participant);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!targetDeleteParticipant) return;
    setIsDeleteLoading(true);
    // Mock DELETE delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setParticipants((prev) =>
      prev.filter((p) => p.id !== targetDeleteParticipant.id)
    );
    setIsDeleteLoading(false);
    setIsDeleteModalOpen(false);
    setTargetDeleteParticipant(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{group.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          팀점 진행일: {group.lunchDateDisplay}
        </p>
      </div>

      <ParticipantForm
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        nameInput={nameInput}
        onNameChange={setNameInput}
        onSubmit={handleRegisterClick}
        isDisabled={!selectedTeam || !nameInput.trim() || isDuplicate}
        isDuplicate={isDuplicate}
      />

      <Separator />

      <ParticipantList
        participants={participants}
        onDeleteClick={handleDeleteClick}
      />

      <RegisterConfirmDialog
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        team={selectedTeam}
        name={nameInput}
        groupTitle={group.title}
        lunchDateDisplay={group.lunchDateDisplay}
        isLoading={isRegisterLoading}
        onConfirm={handleRegisterConfirm}
      />

      <DeleteConfirmDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        participant={targetDeleteParticipant}
        isLoading={isDeleteLoading}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
