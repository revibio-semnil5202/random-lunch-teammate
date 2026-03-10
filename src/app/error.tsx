"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GlobalError({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Global error:", error);
    toast.error("접속자가 많아 연결이 지연되고 있습니다. 잠시 후 다시 시도해주세요.");
    router.replace("/login");
  }, [error, router]);

  return null;
}
