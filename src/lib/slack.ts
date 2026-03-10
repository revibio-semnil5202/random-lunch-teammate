// TODO: 서비스 배포 후 실제 URL로 교체
const SERVICE_URL = "https://example.com";

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: { type: string; text: string }[];
  accessory?: { type: string; text: { type: string; text: string; emoji?: boolean }; url: string };
}

async function sendSlackMessage(webhookUrl: string, blocks: SlackBlock[]) {
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
  participantCount: number,
  groupId: string
) {
  const blocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `📢 *[${groupTitle}] 이번 주 점심 매칭 안내*`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `이번 주 *${lunchDay}* 점심 매칭이 진행됩니다.\n현재 *${participantCount}명*이 참여 중입니다.\n\n아직 참여 등록을 안 하신 분은 아래 링크에서 등록해주세요!`,
      },
      accessory: {
        type: "button",
        text: { type: "plain_text", text: "참여하기", emoji: true },
        url: `${SERVICE_URL}/groups/${groupId}`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "랜덤 점심 팀메이트 🍽️",
        },
      ],
    },
  ];

  await sendSlackMessage(webhookUrl, blocks);
}

/**
 * 2. 마감 전 리마인더
 */
export async function sendDeadlineReminder(
  webhookUrl: string,
  groupTitle: string,
  deadlineTime: string,
  participantCount: number,
  groupId: string
) {
  const blocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `⏰ *[${groupTitle}] 점심 매칭 마감 임박!*`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `오늘 *${deadlineTime}*에 매칭이 마감됩니다.\n현재 *${participantCount}명* 참여 중입니다.\n\n아직 참여하지 않았거나, 참여가 어려운 분은 마감 전에 수정 부탁드립니다.`,
      },
      accessory: {
        type: "button",
        text: { type: "plain_text", text: "확인하기", emoji: true },
        url: `${SERVICE_URL}/groups/${groupId}`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "랜덤 점심 팀메이트 🍽️",
        },
      ],
    },
  ];

  await sendSlackMessage(webhookUrl, blocks);
}

/**
 * 3. 매칭 결과 발표
 */
export async function sendMatchResult(
  webhookUrl: string,
  groupTitle: string,
  groupCount: number,
  totalMembers: number,
  groupId: string
) {
  const blocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🎉 *[${groupTitle}] 점심 매칭 결과 발표!*`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `총 *${totalMembers}명*이 *${groupCount}개 조*로 매칭되었습니다.\n\n아래 링크에서 매칭 결과를 확인해주세요!`,
      },
      accessory: {
        type: "button",
        text: { type: "plain_text", text: "결과 보기", emoji: true },
        url: `${SERVICE_URL}/groups/${groupId}`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "랜덤 점심 팀메이트 🍽️",
        },
      ],
    },
  ];

  await sendSlackMessage(webhookUrl, blocks);
}
