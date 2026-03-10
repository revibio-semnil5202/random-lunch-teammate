export const dynamic = "force-dynamic";

import { getGroupConfigs } from "@/actions/admin";
import { GroupManagement } from "@/components/group-management";

export default async function AdminGroupsPage() {
  const configs = await getGroupConfigs();
  return <GroupManagement initialConfigs={configs} />;
}
