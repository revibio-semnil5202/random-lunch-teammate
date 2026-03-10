import Link from "next/link";
import { Calendar, ChevronRight, Trophy } from "lucide-react";
import type { Group } from "@/types";

interface PastMatchTableProps {
  groups: Group[];
}

export function PastMatchTable({ groups }: PastMatchTableProps) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-bold">지난 팀점 기록</h2>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                그룹 이름
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground w-32">
                진행일
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id} className="group border-b last:border-b-0">
                <td colSpan={3} className="p-0">
                  <Link
                    href={`/groups/${group.id}`}
                    className="flex items-center px-4 py-3.5 transition-colors hover:bg-accent"
                  >
                    <span className="flex-1 text-sm font-medium">
                      {group.title}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground w-32">
                      <Calendar className="h-3.5 w-3.5" />
                      {group.lunchDateDisplay}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
