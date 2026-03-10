"use client";

import { useState, useEffect, useCallback } from "react";
import { Shuffle } from "lucide-react";
import confetti from "canvas-confetti";
import { MatchResult } from "@/components/match-result";
import type { Group } from "@/types";

interface MatchRevealProps {
  group: Group;
  alreadySeen: boolean;
}

const REVEAL_DURATION = 3500;

const shuffleTexts = [
  "팀원을 섞고 있어요",
  "최적의 조합을 찾는 중",
  "두근두근...",
  "거의 다 됐어요!",
];

function fireConfetti() {
  const defaults = {
    spread: 70,
    ticks: 120,
    gravity: 0.7,
    decay: 0.94,
    startVelocity: 50,
    scalar: 1.3,
    colors: ["#10b981", "#34d399", "#6ee7b7", "#3b82f6", "#60a5fa", "#a78bfa"],
  };

  // 1차
  confetti({
    ...defaults,
    particleCount: 100,
    origin: { x: 0, y: 1 },
    angle: 60,
  });
  confetti({
    ...defaults,
    particleCount: 100,
    origin: { x: 1, y: 1 },
    angle: 120,
  });

  // 2차
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 80,
      origin: { x: 0, y: 1 },
      angle: 70,
      startVelocity: 40,
    });
    confetti({
      ...defaults,
      particleCount: 80,
      origin: { x: 1, y: 1 },
      angle: 110,
      startVelocity: 40,
    });
  }, 300);

  // 3차
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 60,
      origin: { x: 0, y: 1 },
      angle: 55,
      startVelocity: 35,
    });
    confetti({
      ...defaults,
      particleCount: 60,
      origin: { x: 1, y: 1 },
      angle: 125,
      startVelocity: 35,
    });
  }, 600);
}

function setRevealedCookie(groupId: string) {
  const maxAge = 12 * 60 * 60; // 12시간
  document.cookie = `match-revealed-${groupId}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function MatchReveal({ group, alreadySeen }: MatchRevealProps) {
  const [phase, setPhase] = useState<"revealing" | "done">(alreadySeen ? "done" : "revealing");
  const [textIndex, setTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleReveal = useCallback(() => {
    setPhase("done");
    setRevealedCookie(group.id);
    requestAnimationFrame(() => {
      fireConfetti();
    });
  }, [group.id]);

  useEffect(() => {
    if (phase === "done") return;

    // 텍스트 셔플
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % shuffleTexts.length);
    }, 800);

    // 프로그레스 업데이트
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(elapsed / REVEAL_DURATION, 1));
    }, 30);

    const timer = setTimeout(handleReveal, REVEAL_DURATION);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [phase, handleReveal]);

  if (phase === "done") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <MatchResult group={group} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* 펄스 링 + 아이콘 */}
        <div className="relative flex items-center justify-center">
          {/* 바깥 펄스 링 */}
          <div className="absolute h-32 w-32 animate-ping rounded-full bg-emerald-200/30 [animation-duration:1.5s]" />
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-emerald-300/40 [animation-duration:1.5s] [animation-delay:0.3s]" />

          {/* 중앙 heartbeat 아이콘 */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 animate-heartbeat">
            <Shuffle className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* 셔플 텍스트 */}
        <div className="h-7 flex items-center justify-center">
          <p
            key={textIndex}
            className="text-lg font-semibold text-foreground animate-in fade-in zoom-in-95 duration-300"
          >
            {shuffleTexts[textIndex]}
          </p>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-48 overflow-hidden rounded-full bg-muted h-1.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* 참여자 이름 미리보기 (셔플 효과) */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {group.participants.slice(0, 6).map((p, i) => (
            <span
              key={p.id}
              className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
