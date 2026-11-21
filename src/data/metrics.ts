import type { MetricKey } from '../types.ts'

export const metricOrder = ['posts', 'comments', 'followerGain', 'impressions'] as const satisfies readonly MetricKey[]

export const metricMeta: Record<
  MetricKey,
  { label: string; unit: string; noun: string; method: string; signed: boolean }
> = {
  posts: {
    label: '发帖榜',
    unit: '篇',
    noun: '发帖',
    method: '只计条数，不区分长短',
    signed: false,
  },
  comments: {
    label: '评论榜',
    unit: '条',
    noun: '评论',
    method: '计发出的评论，不是收到的回复',
    signed: false,
  },
  followerGain: {
    label: '涨粉榜',
    unit: '人',
    noun: '净增粉丝',
    method: '净增，已经扣掉取关',
    signed: true,
  },
  impressions: {
    label: '曝光榜',
    unit: '次',
    noun: '曝光',
    method: '当日帖文曝光合计',
    signed: false,
  },
}

export const trendLabel = {
  rising: '上升中',
  peak: '见顶',
  cooling: '退烧',
} as const
