import Link from "next/link";
import { Calendar, Users, ChevronRight, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Group } from "@/types";

interface GroupCardProps {
  group: Group;
}

const isMatched = (group: Group) => group.status === "matched";

export function GroupCard({ group }: GroupCardProps) {
  const matched = isMatched(group);

  return (
    <Link href={`/groups/${group.id}`} className="block">
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5",
          matched
            ? "bg-gradient-to-br from-amber-50 via-background to-amber-50/50"
            : "bg-gradient-to-br from-primary/5 via-background to-primary/10"
        )}
      >
        {/* 좌측 컬러 바 */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-1 rounded-l-2xl",
            matched ? "bg-amber-500" : "bg-primary"
          )}
        />

        {/* 상단: 타이틀 + 상태 뱃지 */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-base font-bold leading-snug text-foreground">
            {group.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {matched ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <Trophy className="h-3 w-3" />
                결과보기
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <Clock className="h-3 w-3" />
                모집중
              </span>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>
        </div>

        {/* 하단: 메타 정보 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                matched ? "bg-amber-100" : "bg-primary/10"
              )}
            >
              <Users
                className={cn(
                  "h-3.5 w-3.5",
                  matched ? "text-amber-600" : "text-primary"
                )}
              />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {group.participants.length}명
            </span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                matched ? "bg-amber-100" : "bg-primary/10"
              )}
            >
              <Calendar
                className={cn(
                  "h-3.5 w-3.5",
                  matched ? "text-amber-600" : "text-primary"
                )}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {group.lunchDateDisplay}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
