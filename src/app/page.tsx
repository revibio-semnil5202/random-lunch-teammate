import { mockGroups, mockPastGroups } from "@/mocks/groups";
import { GroupCard } from "@/components/group-card";
import { PastMatchTable } from "@/components/past-match-table";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">대시보드</h1>

      <div className="space-y-16">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">이번 주 팀점</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>

        <PastMatchTable groups={mockPastGroups} />
      </div>
    </div>
  );
}
