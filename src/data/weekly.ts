import type { WeeklyChampion } from '../types.ts'

/** 近七日合计冠军。series 从 11 月 15 日到 11 月 21 日，末项与样本日当日数字一致。 */
export const weeklyChampions: readonly WeeklyChampion[] = [
  {
    metric: 'posts',
    handle: 'linchengchuan',
    total: 214,
    series: [22, 28, 31, 26, 35, 34, 38],
    note: '七天都留在高位，没有靠单独一天冲上去。',
  },
  {
    metric: 'comments',
    handle: 'xubanxia',
    total: 2_486,
    series: [310, 340, 360, 280, 390, 394, 412],
    note: '提问的密度比发帖更稳定。',
  },
  {
    metric: 'followerGain',
    handle: 'handu_lab',
    total: 31_240,
    series: [4_200, 3_800, 5_100, 2_900, 4_600, 3_800, 6_840],
    note: '工作日的短帖持续带来新读者。',
  },
  {
    metric: 'impressions',
    handle: 'suwanbai',
    total: 28_460_000,
    series: [3_200_000, 4_100_000, 2_800_000, 3_600_000, 4_500_000, 3_840_000, 6_420_000],
    note: '短段落在这一周被反复打开。',
  },
]
