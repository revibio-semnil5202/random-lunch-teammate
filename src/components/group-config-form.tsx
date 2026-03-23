"use client";

import { useState } from "react";
import { Plus, X, Repeat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/time-picker";
import { PresetMembersInput } from "@/components/preset-members-input";
import { DAYS_OF_WEEK } from "@/types";
import type {
  GroupConfig,
  GroupType,
  DayOfWeek,
  RegistrationType,
  PresetMember,
} from "@/types";

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
  const [groupType, setGroupType] = useState<GroupType>(
    config?.groupType ?? "company",
  );
  const [registrationType, setRegistrationType] = useState<RegistrationType>(
    config?.registrationType ?? "self",
  );
  const [presetMembersList, setPresetMembersList] = useState<PresetMember[]>(
    config?.presetMembers ?? [],
  );
  const isEditing = !!config;
  const [title, setTitle] = useState(config?.title ?? "");
  const [schedule, setSchedule] = useState<DayOfWeek[]>(
    config?.schedule ?? ["수"],
  );
  const [maxParticipants, setMaxParticipants] = useState(
    config?.maxParticipants ?? 4,
  );
  const [maxParticipantsInput, setMaxParticipantsInput] = useState(
    String(config?.maxParticipants ?? 4),
  );
  const [matchDeadlineTime, setMatchDeadlineTime] = useState(
    config?.matchDeadlineTime ?? "11:00",
  );
  const [slackChannelUrl, setSlackChannelUrl] = useState(
    config?.slackChannelUrl ?? "",
  );
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(
    config?.slackWebhookUrl ?? "",
  );
  const [isLimited, setIsLimited] = useState(config?.maxRounds != null);
  const [maxRounds, setMaxRounds] = useState(config?.maxRounds ?? 1);
  const [maxRoundsInput, setMaxRoundsInput] = useState(
    String(config?.maxRounds ?? 1),
  );

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
      groupType,
      registrationType,
      schedule,
      maxParticipants,
      matchDeadlineTime,
      slackChannelUrl: slackChannelUrl.trim() || undefined,
      slackWebhookUrl: slackWebhookUrl.trim() || undefined,
      maxRounds: isLimited ? maxRounds : undefined,
      presetMembers:
        registrationType === "preset" ? presetMembersList : undefined,
    });
  };

  const isValid =
    title.trim() &&
    maxParticipants >= 3 &&
    schedule.length > 0 &&
    (registrationType !== "preset" || presetMembersList.length > 0);

  // maxRounds보다 큰 인덱스의 주차는 실행되지 않음
  const disabledFromIndex = isLimited ? maxRounds : null;

  // 마운트 시점의 KST 요일 (렌더 중 Date.now 호출 방지)
  const [todayDayOfWeek] = useState(() => {
    const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
    return kstNow.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  });
  const isWeekend = todayDayOfWeek === 0 || todayDayOfWeek === 6;
  const KOREAN_DAY_NUM: Record<string, number> = {
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
  };
  const firstDayNum = KOREAN_DAY_NUM[schedule[0]] ?? 1;
  const isFirstDayNextWeek = isWeekend || firstDayNum <= todayDayOfWeek;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 그룹 타입 */}
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-semibold">그룹 타입</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            그룹 타입은 생성 후 변경할 수 없습니다.
          </p>
        </div>
        <div
          className={cn(
            "flex gap-2",
            isEditing && "opacity-50 pointer-events-none",
          )}
        >
          <button
            type="button"
            onClick={() => setGroupType("company")}
            className={cn(
              "flex-1 rounded-lg border px-3 py-3 text-sm font-medium transition-all cursor-pointer",
              groupType === "company"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-input bg-background hover:bg-accent",
            )}
          >
            <div className="font-semibold">팀 구분</div>
            <div
              className={cn(
                "text-xs mt-0.5",
                groupType === "company"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground",
              )}
            >
              <p>소속 팀 + 이름 입력</p>
              <p>(여러 팀 혼합 시)</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setGroupType("team")}
            className={cn(
              "flex-1 rounded-lg border px-3 py-3 text-sm font-medium transition-all cursor-pointer",
              groupType === "team"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-input bg-background hover:bg-accent",
            )}
          >
            <div className="font-semibold">팀 미구분</div>
            <div
              className={cn(
                "text-xs mt-0.5",
                groupType === "team"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground",
              )}
            >
              <p>이름만 입력</p>
              <p>(단일 팀일 때)</p>
            </div>
          </button>
        </div>
      </div>

      {/* 등록 방식 */}
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-semibold">등록 방식</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            등록 방식은 생성 후 변경할 수 없습니다.
          </p>
        </div>
        <div
          className={cn(
            "flex gap-2",
            isEditing && "opacity-50 pointer-events-none",
          )}
        >
          <button
            type="button"
            onClick={() => setRegistrationType("self")}
            className={cn(
              "flex-1 rounded-lg border px-3 py-3 text-sm font-medium transition-all cursor-pointer",
              registrationType === "self"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-input bg-background hover:bg-accent",
            )}
          >
            <div className="font-semibold">직접등록</div>
            <div
              className={cn(
                "text-xs mt-0.5",
                registrationType === "self"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground",
              )}
            >
              참가자가 직접 등록
            </div>
          </button>
          <button
            type="button"
            onClick={() => setRegistrationType("preset")}
            className={cn(
              "flex-1 rounded-lg border px-3 py-3 text-sm font-medium transition-all cursor-pointer",
              registrationType === "preset"
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-input bg-background hover:bg-accent",
            )}
          >
            <div className="font-semibold">사전등록</div>
            <div
              className={cn(
                "text-xs mt-0.5",
                registrationType === "preset"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground",
              )}
            >
              관리자가 미리 등록
            </div>
          </button>
        </div>
      </div>

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

      {/* 사전등록 참가자 (preset 모드에서만) */}
      {registrationType === "preset" && (
        <PresetMembersInput
          groupType={groupType}
          value={presetMembersList}
          onChange={setPresetMembersList}
        />
      )}

      {/* 요일 로테이션 */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-semibold">진행 요일</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            1주차만 설정하면 매주 같은 요일에 진행됩니다. 주차를 추가하면 설정한
            요일이 순서대로 반복됩니다.
          </p>
        </div>

        <div className="space-y-2.5">
          {schedule.map((selectedDay, weekIndex) => {
            const isDisabledWeek =
              disabledFromIndex != null && weekIndex >= disabledFromIndex;
            return (
              <div
                key={weekIndex}
                className={cn(
                  "flex items-center gap-2.5",
                  isDisabledWeek && "opacity-40 pointer-events-none",
                )}
              >
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
                          : "border-input bg-background hover:bg-accent",
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
            );
          })}
        </div>

        {schedule.length < 5 && (
          <button
            type="button"
            onClick={addWeek}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-md border border-dashed px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              disabledFromIndex != null &&
                schedule.length >= disabledFromIndex &&
                "opacity-40 pointer-events-none",
            )}
          >
            <Plus className="h-3 w-3" />
            주차 추가
          </button>
        )}

        {/* 로테이션 미리보기 */}
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
          <Repeat className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">
            {isLimited ? (
              schedule.length === 1 ? (
                `${isFirstDayNextWeek ? "다음주" : "이번주"} ${schedule[0]}요일`
              ) : (
                <>
                  {schedule.map((day, i) => (
                    <span key={i}>
                      {i > 0 && " → "}
                      <span
                        className={cn(
                          disabledFromIndex != null &&
                            i >= disabledFromIndex &&
                            "line-through opacity-40",
                        )}
                      >
                        {i === 0
                          ? `${isFirstDayNextWeek ? "다음주" : "이번주"} ${day}`
                          : day}
                      </span>
                    </span>
                  ))}
                </>
              )
            ) : schedule.length === 1 ? (
              `매주 ${schedule[0]}요일`
            ) : (
              <>
                {schedule.map((day, i) => (
                  <span key={i}>
                    {i > 0 && " → "}
                    {day}
                  </span>
                ))}
                {" 반복"}
              </>
            )}
          </span>
        </div>
      </div>

      {/* 진행 횟수 */}
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-semibold">진행 횟수</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            지정한 횟수만큼 매칭이 완료되면 더 이상 새 이벤트가 생성되지
            않습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsLimited(false)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-all cursor-pointer",
              !isLimited
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-input bg-background hover:bg-accent",
            )}
          >
            무제한
          </button>
          <button
            type="button"
            onClick={() => setIsLimited(true)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-all cursor-pointer",
              isLimited
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-input bg-background hover:bg-accent",
            )}
          >
            횟수 지정
          </button>
        </div>
        {isLimited && (
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={100}
              value={maxRoundsInput}
              onChange={(e) => {
                setMaxRoundsInput(e.target.value);
                const v = Number(e.target.value);
                if (!isNaN(v) && v >= 1) setMaxRounds(Math.min(100, v));
              }}
              onBlur={() => {
                const v = Number(maxRoundsInput);
                const clamped = Math.min(100, Math.max(1, isNaN(v) ? 1 : v));
                setMaxRounds(clamped);
                setMaxRoundsInput(String(clamped));
              }}
              className="w-24 h-10 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-sm text-muted-foreground">회</span>
          </div>
        )}
      </div>

      {/* 조별 최대 인원 */}
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-semibold">조별 최대 인원</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            매칭 시 한 조에 배정되는 최대 인원입니다. 최소 3명 이상이어야 조가
            나뉘며, 인원이 부족하면 한 조로 배정될 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={3}
            max={12}
            value={maxParticipantsInput}
            onChange={(e) => setMaxParticipantsInput(e.target.value)}
            onBlur={() => {
              const v = Number(maxParticipantsInput);
              const clamped = Math.min(12, Math.max(3, isNaN(v) ? 4 : v));
              setMaxParticipants(clamped);
              setMaxParticipantsInput(String(clamped));
            }}
            className="w-24 h-10 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-sm text-muted-foreground">명</span>
        </div>
      </div>

      {/* 매칭 마감 시각 */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-semibold">매칭 마감 시각</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            진행 요일 당일, 이 시간에 매칭 결과가 자동으로 발표 및 슬랙 채널로
            레포팅됩니다. 점심시간 최소 1시간 전으로 설정해 주세요.
          </p>
        </div>

        <TimePicker
          value={matchDeadlineTime}
          onChange={setMatchDeadlineTime}
          hourRange={[8, 11]}
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
        <div className="mt-2">
          <span className="text-xs font-semibold text-muted-foreground">
            알림 타이밍
          </span>
          <ul className="text-xs text-muted-foreground space-y-0.5 mt-1">
            <li>- 매주 월요일 10:00 — 이번 주 참여 안내</li>
            <li>- 마감 1시간 전 — 마감 리마인더</li>
            <li>- 마감 시각 — 매칭 결과 발표</li>
          </ul>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex-1"
        >
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
