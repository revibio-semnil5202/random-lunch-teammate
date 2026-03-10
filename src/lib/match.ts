const MIN_GROUP_SIZE = 3;
const MAX_GROUP_SIZE_LIMIT = 12;

interface MatchMember {
  id: string | number;
  [key: string]: unknown;
}

interface MatchConfig {
  maxGroupSize: number;
}

/**
 * Fisher-Yates 셔플
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 균등 분배 알고리즘
 *
 * numGroups = ceil(total / maxSize)
 * baseSize  = floor(total / numGroups)
 * extra     = total % numGroups
 * → extra개 그룹은 (baseSize + 1)명, 나머지는 baseSize명
 */
function distributeIntoGroups<T>(
  members: T[],
  maxGroupSize: number
): T[][] {
  const total = members.length;
  const numGroups = Math.ceil(total / maxGroupSize);
  const baseSize = Math.floor(total / numGroups);
  const extra = total % numGroups;

  const groups: T[][] = [];
  let index = 0;

  for (let i = 0; i < numGroups; i++) {
    const size = i < extra ? baseSize + 1 : baseSize;
    groups.push(members.slice(index, index + size));
    index += size;
  }

  return groups;
}

/**
 * 랜덤 매칭 실행
 *
 * - 3~5명: 한 그룹 (섞을 필요 없음)
 * - 6명 이상: 셔플 후 균등 분배
 * - 최소 3명, 최대 n명 (n ≤ 12)
 */
export function createMatch<T extends MatchMember>(
  members: T[],
  config: MatchConfig
): { success: boolean; message?: string; groups?: T[][] } {
  const total = members.length;
  const maxGroupSize = Math.min(config.maxGroupSize, MAX_GROUP_SIZE_LIMIT);

  if (total < MIN_GROUP_SIZE) {
    return { success: false, message: "매칭에 최소 3명 이상의 멤버가 필요합니다." };
  }

  if (maxGroupSize < MIN_GROUP_SIZE) {
    return { success: false, message: "최대 그룹 인원은 최소 3명 이상이어야 합니다." };
  }

  // 3~5명: 한 그룹으로 그대로
  if (total <= 5) {
    return { success: true, groups: [members] };
  }

  // 6명 이상: 셔플 후 균등 분배
  const shuffled = shuffle(members);
  const groups = distributeIntoGroups(shuffled, maxGroupSize);

  return { success: true, groups };
}
