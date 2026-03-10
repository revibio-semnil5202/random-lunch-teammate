import Link from "next/link";
import { Calendar, Users, ChevronRight } from "lucide-react";
import type { Group } from "@/types";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`} className="block">
      <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-primary/10 p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
        {/* 좌측 컬러 바 */}
        <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-2xl" />

        {/* 상단: 타이틀 + 화살표 */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-base font-bold leading-snug text-foreground">
            {group.title}
          </h3>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>

        {/* 하단: 메타 정보 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {group.participants.length}명
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
    </Link>
  );
}
