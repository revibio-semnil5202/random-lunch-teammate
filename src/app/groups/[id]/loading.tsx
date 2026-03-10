import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GroupLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          대시보드
        </Link>

        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-muted/30 via-background to-muted/20 p-6">
          <div className="absolute left-0 top-0 h-full w-1 bg-muted rounded-l-2xl" />

          <div className="flex flex-col gap-2 mb-3 md:flex-row md:items-start md:justify-between md:gap-3">
            <div className="h-5 w-20 rounded-full bg-muted md:order-2" />
            <div className="h-8 w-56 rounded-lg bg-muted md:order-1" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-7 w-7 rounded-full bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="h-7 w-7 rounded-full bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="h-7 w-7 rounded-full bg-muted" />
              <div className="h-4 w-14 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* 조 카드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border bg-card overflow-hidden">
            <div className="flex items-center justify-between bg-muted/30 px-5 py-3 border-b">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="h-5 w-10 rounded bg-muted" />
              </div>
              <div className="h-5 w-10 rounded-full bg-muted" />
            </div>
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2.5">
                  <div className="h-5 w-12 rounded bg-muted" />
                  <div className="h-4 w-16 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
