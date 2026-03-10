import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { mockGroups, mockPastGroups } from "@/mocks/groups";
import { GroupDetail } from "@/components/group-detail";
import { MatchReveal } from "@/components/match-reveal";
import { MatchResult } from "@/components/match-result";

interface GroupPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;

  const isPast = mockPastGroups.some((g) => g.id === id);
  const allGroups = [...mockGroups, ...mockPastGroups];
  const group = allGroups.find((g) => g.id === id);

  if (!group) {
    notFound();
  }

  // 과거 기록: 리빌/콘페티 없이 결과만 표시
  if (isPast) {
    return <MatchResult group={group} />;
  }

  if (group.status === "matched") {
    const cookieStore = await cookies();
    const alreadySeen = cookieStore.has(`match-revealed-${id}`);
    return <MatchReveal group={group} alreadySeen={alreadySeen} />;
  }

  return <GroupDetail group={group} />;
}
