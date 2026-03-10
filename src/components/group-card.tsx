import Link from "next/link";
import { Calendar, Users, ChevronRight, Trophy, Clock, Ban, AlarmClock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Group } from "@/types";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const { status } = group;
  const cancelled = status === "cancelled";
  const matched = status === "matched";

  const card = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 transition-all",
        cancelled
          ? "bg-gradient-to-br from-rose-50 via-background to-rose-50/50 opacity-75"
          : "hover:shadow-lg hover:-translate-y-0.5",
        matched && "bg-gradient-to-br from-emerald-50 via-background to-emerald-50/50",
        status === "recruiting" && "bg-gradient-to-br from-primary/5 via-background to-primary/10"
      )}
    >
      {/* 좌측 컬러 바 */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 rounded-l-2xl",
          cancelled && "bg-rose-400",
          matched && "bg-emerald-500",
          status === "recruiting" && "bg-primary"
        )}
      />

      {/* 상단: 타이틀 + 상태 뱃지 */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className={cn(
          "text-base font-bold leading-snug",
          cancelled ? "text-muted-foreground line-through" : "text-foreground"
        )}>
          {group.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {cancelled ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
              <Ban className="h-3 w-3" />
              취소됨
            </span>
          ) : matched ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <Trophy className="h-3 w-3" />
              결과보기
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <Clock className="h-3 w-3" />
              모집중
            </span>
          )}
          {!cancelled && (
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          )}
        </div>
      </div>

      {/* 하단: 메타 정보 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full",
              cancelled ? "bg-rose-100" : matched ? "bg-emerald-100" : "bg-primary/10"
            )}
          >
            <Users
              className={cn(
                "h-3.5 w-3.5",
                cancelled ? "text-rose-500" : matched ? "text-emerald-600" : "text-primary"
              )}
            />
          </div>
          <span className={cn(
            "text-sm font-semibold",
            cancelled ? "text-muted-foreground" : "text-foreground"
          )}>
            {group.participants.length}명
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full",
              cancelled ? "bg-rose-100" : matched ? "bg-emerald-100" : "bg-primary/10"
            )}
          >
            <Calendar
              className={cn(
                "h-3.5 w-3.5",
                cancelled ? "text-rose-500" : matched ? "text-emerald-600" : "text-primary"
              )}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {group.lunchDateDisplay}
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full",
              cancelled ? "bg-rose-100" : matched ? "bg-emerald-100" : "bg-primary/10"
            )}
          >
            <AlarmClock
              className={cn(
                "h-3.5 w-3.5",
                cancelled ? "text-rose-500" : matched ? "text-emerald-600" : "text-primary"
              )}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {group.matchDeadlineDisplay} 마감
          </span>
        </div>
      </div>
    </div>
  );

  // 취소된 그룹은 클릭 불가
  if (cancelled) {
    return <div className="block">{card}</div>;
  }

  return (
    <Link href={`/groups/${group.id}`} className="block">
      {card}
    </Link>
  );
}
