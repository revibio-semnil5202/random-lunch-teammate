import { mockGroupConfigs } from "@/mocks/group-configs";
import { GroupManagement } from "@/components/group-management";

export default function AdminGroupsPage() {
  return <GroupManagement initialConfigs={mockGroupConfigs} />;
}
