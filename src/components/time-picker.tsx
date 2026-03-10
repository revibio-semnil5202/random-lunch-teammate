"use client";

import { useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  hourRange?: [number, number]; // default [0, 23]
  minuteStep?: number; // default 5
}

const ITEM_HEIGHT = 36;

function TimeColumn({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current.querySelector("[data-slot='scroll-area-viewport']");
      if (container) {
        const top = selectedRef.current.offsetTop - ITEM_HEIGHT * 2;
        container.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      }
    }
  }, [selected]);

  return (
    <ScrollArea ref={scrollRef} className="h-[216px]">
      <div className="flex flex-col p-1">
        {items.map((item) => (
          <button
            key={item}
            ref={item === selected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "flex h-9 w-14 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors",
              item === selected
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-foreground"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

export function TimePicker({
  value,
  onChange,
  hourRange = [0, 23],
  minuteStep = 5,
}: TimePickerProps) {
  const [h, m] = value.split(":");

  const hours = Array.from(
    { length: hourRange[1] - hourRange[0] + 1 },
    (_, i) => String(i + hourRange[0]).padStart(2, "0")
  );

  const minutes = Array.from(
    { length: Math.floor(60 / minuteStep) },
    (_, i) => String(i * minuteStep).padStart(2, "0")
  );

  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex h-10 w-28 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold">{value}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex divide-x">
          <div className="flex flex-col items-center">
            <span className="px-3 py-2 text-xs font-semibold text-muted-foreground">시</span>
            <TimeColumn
              items={hours}
              selected={h}
              onSelect={(newH) => onChange(`${newH}:${m}`)}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="px-3 py-2 text-xs font-semibold text-muted-foreground">분</span>
            <TimeColumn
              items={minutes}
              selected={m}
              onSelect={(newM) => onChange(`${h}:${newM}`)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
