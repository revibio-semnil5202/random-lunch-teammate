"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Users, Trophy, Shuffle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Group } from "@/types";

interface MatchResultProps {
  group: Group;
}

export function MatchResult({ group }: MatchResultProps) {
  const matchResult = group.matchResult ?? [];

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

        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50 via-background to-emerald-50/50 p-6">
          <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-l-2xl" />

          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-2xl font-bold">{group.title}</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 shrink-0">
              <Trophy className="h-3.5 w-3.5" />
              매칭 완료
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                <Users className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold">
                {group.participants.length}명 참여
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {group.lunchDateDisplay}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                <Shuffle className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {matchResult.length}개 조
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 매칭 결과 조 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {matchResult.map((matchGroup) => (
          <div
            key={matchGroup.groupIndex}
            className="rounded-2xl border bg-card overflow-hidden"
          >
            {/* 조 헤더 */}
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-transparent px-5 py-3 border-b">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">
                  {matchGroup.groupIndex}
                </div>
                <span className="font-semibold">{matchGroup.groupIndex}조</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-0">
                {matchGroup.members.length}명
              </Badge>
            </div>

            {/* 조 멤버 */}
            <div className="p-4 space-y-2">
              {matchGroup.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5"
                >
                  <span className="inline-flex items-center justify-center rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                    {member.team}
                  </span>
                  <span className="text-sm font-medium">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
