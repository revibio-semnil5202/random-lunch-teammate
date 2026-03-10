import { notFound } from "next/navigation";
import { mockGroups } from "@/mocks/groups";
import { GroupDetail } from "@/components/group-detail";

interface GroupPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;
  const group = mockGroups.find((g) => g.id === id);

  if (!group) {
    notFound();
  }

  return <GroupDetail group={group} />;
}
