const SERVICE_URL = process.env.APP_URL ?? "https://example.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendSlackMessage(webhookUrl: string, blocks: any[]) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Slack webhook 실패: ${res.status} ${text}`);
  }
}

/**
 * 1. 주간 참여 안내 (매주 월요일 오전 10시)
 */
export async function sendWeeklyNotice(
  webhookUrl: string,
  groupTitle: string,
  lunchDay: string,
  groupId: string
) {
  const link = `${SERVICE_URL}/groups/${groupId}`;
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🍽️ *[${groupTitle}] 이번 주 팀점 참여자를 모집합니다!*\n\n이번 주 *${lunchDay}* 팀점이 진행됩니다.\n아래 링크에서 참여해 주세요.\n\n👉 <${link}|참여하기>`,
      },
    },
    {
      type: "context",
      elements: [
        { type: "mrkdwn", text: "랜덤 점심 팀메이트" },
      ],
    },
  ];

  await sendSlackMessage(webhookUrl, blocks);
}

/**
 * 2. 마감 전 리마인더 (매칭 당일, match_deadline - 1시간)
 */
export async function sendDeadlineReminder(
  webhookUrl: string,
  groupTitle: string,
  deadlineTime: string,
  participantCount: number,
  groupId: string
) {
  const link = `${SERVICE_URL}/groups/${groupId}`;
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `⏰ *[${groupTitle}] 오늘 팀점 매칭까지 1시간 남았어요!*\n\n오늘 *${deadlineTime}*에 매칭이 마감됩니다.\n현재 *${participantCount}명* 참여 중입니다.\n\n혹시 사정이 생기셨다면 지금 참여 명단에서 이름을 빼주세요.\n\n👉 <${link}|확인하기>`,
      },
    },
    {
      type: "context",
      elements: [
        { type: "mrkdwn", text: "랜덤 점심 팀메이트" },
      ],
    },
  ];

  await sendSlackMessage(webhookUrl, blocks);
}

/**
 * 3. 매칭 결과 발표 (매칭 완료 직후)
 */
export async function sendMatchResult(
  webhookUrl: string,
  groupTitle: string,
  groupCount: number,
  totalMembers: number,
  groupId: string
) {
  const link = `${SERVICE_URL}/groups/${groupId}`;
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🎉 *[${groupTitle}] 팀점 매칭 결과가 나왔습니다!*\n\n총 *${totalMembers}명*이 *${groupCount}개 조*로 매칭되었습니다.\n\n누구와 함께하게 되었는지 확인해 보세요.\n\n👉 <${link}|결과 보기>`,
      },
    },
    {
      type: "context",
      elements: [
        { type: "mrkdwn", text: "랜덤 점심 팀메이트" },
      ],
    },
  ];

  await sendSlackMessage(webhookUrl, blocks);
}
