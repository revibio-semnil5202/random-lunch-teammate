export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          랜덤 점심 팀메이트
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          오늘 점심, 누구와 함께할까요?
        </p>
        <button className="rounded-full bg-zinc-900 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300">
          랜덤 매칭 시작
        </button>
      </main>
    </div>
  );
}
