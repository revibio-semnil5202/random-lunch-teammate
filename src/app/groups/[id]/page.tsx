import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { mockGroups, mockPastGroups } from "@/mocks/groups";
import { GroupDetail } from "@/components/group-detail";
import { MatchReveal } from "@/components/match-reveal";

interface GroupPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;
  const allGroups = [...mockGroups, ...mockPastGroups];
  const group = allGroups.find((g) => g.id === id);

  if (!group) {
    notFound();
  }

  if (group.status === "matched") {
    const cookieStore = await cookies();
    const alreadySeen = cookieStore.has(`match-revealed-${id}`);
    return <MatchReveal group={group} alreadySeen={alreadySeen} />;
  }

  return <GroupDetail group={group} />;
}
