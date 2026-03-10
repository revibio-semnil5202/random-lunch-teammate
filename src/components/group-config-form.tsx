"use client";

import { useState, useEffect } from "react";
import { Plus, X, Repeat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK } from "@/types";
import type { GroupConfig, DayOfWeek } from "@/types";

interface GroupConfigFormProps {
  config?: GroupConfig | null;
  onSubmit: (data: Omit<GroupConfig, "id" | "createdAt">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function GroupConfigForm({
  config,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: GroupConfigFormProps) {
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState<DayOfWeek[]>(["수"]);
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [matchDeadlineTime, setMatchDeadlineTime] = useState("11:00");
  const [slackChannelUrl, setSlackChannelUrl] = useState("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");

  useEffect(() => {
    if (config) {
      setTitle(config.title);
      setSchedule(config.schedule);
      setMaxParticipants(config.maxParticipants);
      setMatchDeadlineTime(config.matchDeadlineTime);
      setSlackChannelUrl(config.slackChannelUrl ?? "");
      setSlackWebhookUrl(config.slackWebhookUrl ?? "");
    }
  }, [config]);

  const handleDayChange = (weekIndex: number, day: DayOfWeek) => {
    setSchedule((prev) => prev.map((d, i) => (i === weekIndex ? day : d)));
  };

  const addWeek = () => {
    if (schedule.length >= 5) return;
    // 다음 주차는 아직 안 쓴 요일 중 첫 번째, 없으면 "목"
    const used = new Set(schedule);
    const next = DAYS_OF_WEEK.find((d) => !used.has(d)) ?? "목";
    setSchedule((prev) => [...prev, next]);
  };

  const removeWeek = (index: number) => {
    if (schedule.length <= 1) return;
    setSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      schedule,
      maxParticipants,
      matchDeadlineTime,
      slackChannelUrl: slackChannelUrl.trim() || undefined,
      slackWebhookUrl: slackWebhookUrl.trim() || undefined,
    });
  };

  const isValid = title.trim() && maxParticipants >= 3 && schedule.length > 0;

  const previewText =
    schedule.length === 1
      ? `매주 ${schedule[0]}요일`
      : schedule.join(" → ") + " 반복";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 그룹 이름 */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">그룹 이름</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ex) 리비바이오&알렌의서재"
          maxLength={50}
          className="text-base h-10"
        />
      </div>

      {/* 요일 로테이션 */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">진행 요일</Label>

        <div className="space-y-2.5">
          {schedule.map((selectedDay, weekIndex) => (
            <div key={weekIndex} className="flex items-center gap-2.5">
              <span className="w-14 shrink-0 text-xs font-semibold text-muted-foreground">
                {weekIndex + 1}주차
              </span>
              <div className="flex gap-1.5">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayChange(weekIndex, day)}
                    className={cn(
                      "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-xs font-medium transition-all",
                      selectedDay === day
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-input bg-background hover:bg-accent"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {schedule.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWeek(weekIndex)}
                  className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {schedule.length < 5 && (
          <button
            type="button"
            onClick={addWeek}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-dashed px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Plus className="h-3 w-3" />
            주차 추가
          </button>
        )}

        {/* 로테이션 미리보기 */}
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
          <Repeat className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">{previewText}</span>
        </div>
      </div>

      {/* 조별 최대 인원 */}
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-semibold">조별 최대 인원</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            매칭 시 한 조에 배정되는 최대 인원입니다. 최소 3명으로 고정됩니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={3}
            max={12}
            value={maxParticipants}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMaxParticipants(Math.min(12, Math.max(3, v)));
            }}
            className="w-24 h-10 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-sm text-muted-foreground">명</span>
        </div>
      </div>

      {/* 매칭 마감 시각 */}
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-semibold">매칭 마감 시각</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            이 시간에 매칭 결과가 자동으로 발표됩니다.
          </p>
        </div>
        <Input
          type="time"
          value={matchDeadlineTime}
          onChange={(e) => setMatchDeadlineTime(e.target.value)}
          className="w-32 h-10"
        />
      </div>

      {/* 슬랙 채널 바로가기 */}
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-semibold">
            슬랙 채널 바로가기
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (선택)
            </span>
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            매칭 결과 페이지에서 슬랙 채널로 이동하는 버튼에 사용됩니다.
          </p>
        </div>
        <Input
          value={slackChannelUrl}
          onChange={(e) => setSlackChannelUrl(e.target.value)}
          placeholder="https://slack.com/app_redirect?channel=..."
          className="text-sm h-10"
        />
      </div>

      {/* 슬랙 알림 Webhook */}
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-semibold">
            슬랙 알림 Webhook
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (선택)
            </span>
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            참여 안내, 마감 리마인더, 매칭 결과를 자동으로 슬랙에 발송합니다.
          </p>
        </div>
        <Input
          value={slackWebhookUrl}
          onChange={(e) => setSlackWebhookUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
          className="text-sm h-10"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={!isValid || isSubmitting} className="flex-1">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {config ? "수정" : "추가"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          취소
        </Button>
      </div>
    </form>
  );
}
