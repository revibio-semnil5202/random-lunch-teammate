import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function GroupNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-2xl font-bold">그룹을 찾을 수 없습니다</h2>
      <p className="text-muted-foreground">요청하신 그룹이 존재하지 않습니다.</p>
      <Link href="/" className={buttonVariants()}>
        대시보드로 돌아가기
      </Link>
    </div>
  );
}
