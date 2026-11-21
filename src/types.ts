export type MetricKey = 'posts' | 'comments' | 'followerGain' | 'impressions'

export type Trend = 'rising' | 'peak' | 'cooling'

export type FollowerTier = 'all' | 'lt1k' | '1k-10k' | '10k-100k' | '100k-1m' | 'gte1m'

export type DarkHorse = 'off' | 'lt5k' | '5k-10k'

export type SortKey = 'followers' | 'impressions' | 'posts' | 'comments' | 'avgImpressions'

export type SortDir = 'asc' | 'desc'

export interface Account {
  handle: string
  name: string
  followers: number
  followerGain: number
  impressions: number
  posts: number
  comments: number
  category: string
  city: string
  hue: number
  since: string
  bio: string
  samples: readonly string[]
}

export interface ViralPost {
  id: string
  handle: string
  excerpt: string
  impressions: number
  category: string
  time: string
}

export interface Topic {
  id: string
  name: string
  category: string
  impressions: number
  postCount: number
  peopleCount: number
  trend: Trend
  angles: readonly string[]
  example: {
    handle: string
    text: string
    impressions: number
  }
}

export interface Article {
  id: string
  handle: string
  title: string
  excerpt: string
  bookmarks: number
  reads: number
  category: string
  publishedOn: string
  minutes: number
}

export interface HallRecord {
  id: string
  date: string
  metric: MetricKey
  handle: string
  value: number
  debut: boolean
  note: string
}

export interface WeeklyChampion {
  metric: MetricKey
  handle: string
  total: number
  series: readonly number[]
  note: string
}

export interface BoardEntry {
  rank: number
  handle: string
  name: string
  hue: number
  category: string
  value: number
}

export interface DailyBoard {
  metric: MetricKey
  label: string
  unit: string
  noun: string
  method: string
  signed: boolean
  entries: BoardEntry[]
}

export interface WeeklyBoard {
  metric: MetricKey
  label: string
  unit: string
  signed: boolean
  handle: string
  name: string
  hue: number
  category: string
  total: number
  series: readonly number[]
  note: string
}

export interface AccountQuery {
  tier: FollowerTier
  darkHorse: DarkHorse
  sortKey: SortKey
  sortDir: SortDir
  savedOnly: boolean
  saved: readonly string[]
}

export interface AccountRow {
  handle: string
  name: string
  hue: number
  category: string
  city: string
  followers: number
  impressions: number
  posts: number
  comments: number
  avgImpressions: number
}

export interface RankLine {
  metric: MetricKey
  label: string
  rank: number
  total: number
  value: number
  signed: boolean
  unit: string
}

export interface Highlight {
  id: string
  title: string
  detail: string
}

export interface ProfilePost {
  id: string
  kind: '热帖' | '长文' | '近况'
  title: string
  text: string
  stat: string
  when: string
}

export interface AccountProfile {
  handle: string
  name: string
  followers: number
  followerGain: number
  impressions: number
  posts: number
  comments: number
  avgImpressions: number
  category: string
  city: string
  hue: number
  since: string
  bio: string
  ranks: RankLine[]
  highlights: Highlight[]
  feed: ProfilePost[]
}

export interface PostCard {
  id: string
  handle: string
  name: string
  hue: number
  excerpt: string
  impressions: number
  category: string
  time: string
}

export interface Contributor {
  handle: string
  name: string
  hue: number
  count: number
  score: number
  scoreLabel: string
}

export interface TopicCard {
  id: string
  name: string
  category: string
  impressions: number
  postCount: number
  peopleCount: number
  trend: Trend
  trendLabel: string
  angles: readonly string[]
  example: {
    handle: string
    name: string
    hue: number
    text: string
    impressions: number
  }
}

export interface ArticleCard {
  id: string
  handle: string
  name: string
  hue: number
  title: string
  excerpt: string
  bookmarks: number
  reads: number
  category: string
  publishedOn: string
  minutes: number
}

export interface HallCard {
  id: string
  date: string
  dateLabel: string
  metric: MetricKey
  label: string
  handle: string
  name: string
  hue: number
  value: number
  signed: boolean
  unit: string
  debut: boolean
  note: string
}

export interface Teaser {
  to: string
  kicker: string
  title: string
  detail: string
}
