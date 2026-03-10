"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
    toast.error("접속자가 많아 연결이 지연되고 있습니다. 잠시 후 다시 시도해주세요.");
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <p className="text-muted-foreground">일시적으로 연결할 수 없습니다.</p>
      <Button onClick={reset} variant="outline" className="cursor-pointer gap-2">
        <RefreshCw className="h-4 w-4" />
        다시 시도
      </Button>
    </div>
  );
}
