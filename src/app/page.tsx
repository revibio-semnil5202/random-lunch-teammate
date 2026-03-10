export const dynamic = "force-dynamic";

import { getGroups } from "@/actions/groups";
import { GroupCard } from "@/components/group-card";
import { PastMatchTable } from "@/components/past-match-table";
import { UtensilsCrossed } from "lucide-react";

export default async function DashboardPage() {
  const { active, past } = await getGroups();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">대시보드</h1>

      <div className="space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">이번 주 팀점</h2>
          </div>
          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              이번 주 등록된 팀점이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>

        <PastMatchTable groups={past} />
      </div>
    </div>
  );
}
