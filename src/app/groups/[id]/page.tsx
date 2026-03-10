import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getGroupDetail } from "@/actions/groups";
import { GroupDetail } from "@/components/group-detail";
import { MatchReveal } from "@/components/match-reveal";
import { MatchResult } from "@/components/match-result";

interface GroupPageProps {
  params: Promise<{ id: string }>;
}

function getThisWeekMonday(): Date {
  // KST 기준 이번 주 월요일
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const dayOfWeek = now.getUTCDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayDate = now.getUTCDate() + diffToMonday;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), mondayDate));
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;

  const group = await getGroupDetail(id);

  if (!group) {
    notFound();
  }

  const thisWeekMonday = getThisWeekMonday();
  const [year, month, day] = group.lunchDate.split("-").map(Number);
  const lunchDateObj = new Date(Date.UTC(year, month - 1, day));
  const isPast = lunchDateObj < thisWeekMonday;

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
