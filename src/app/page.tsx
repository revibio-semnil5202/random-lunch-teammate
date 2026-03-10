import { mockGroups } from "@/mocks/groups";
import { GroupCard } from "@/components/group-card";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 mt-10">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
