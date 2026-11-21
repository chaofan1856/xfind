/**
 * 页面只从这里取数。
 * 以后换成真实接口时，保持这些函数的入参和返回形状，把函数体换掉即可。
 * 样本写在同目录的其他文件里，不要在页面里直接引用。
 */
import { accounts } from './accounts.ts'
import { articles } from './articles.ts'
import { boardMeta } from './meta.ts'
import { metricMeta, metricOrder, trendLabel } from './metrics.ts'
import { viralPosts } from './posts.ts'
import { hallRecords } from './records.ts'
import { topics } from './topics.ts'
import { weeklyChampions } from './weekly.ts'
import { averageImpressions, formatCount, formatMonthDay, formatSigned } from '../lib/format.ts'
import type {
  Account,
  AccountProfile,
  AccountQuery,
  AccountRow,
  ArticleCard,
  Contributor,
  DailyBoard,
  DarkHorse,
  FollowerTier,
  HallCard,
  Highlight,
  MetricKey,
  PostCard,
  ProfilePost,
  RankLine,
  SortKey,
  Teaser,
  TopicCard,
  WeeklyBoard,
} from '../types.ts'

export function getBoardMeta() {
  return boardMeta
}

export function getDailyBoards(): DailyBoard[] {
  return metricOrder.map((metric) => {
    const meta = metricMeta[metric]
    const entries = rankAccounts(metric)
      .slice(0, 5)
      .map((account, index) => toEntry(account, metric, index + 1))
    return {
      metric,
      label: meta.label,
      unit: meta.unit,
      noun: meta.noun,
      method: meta.method,
      signed: meta.signed,
      entries,
    }
  })
}

export function getWeeklyBoards(): WeeklyBoard[] {
  return weeklyChampions.map((item) => {
    const account = requireAccount(item.handle)
    const meta = metricMeta[item.metric]
    return {
      metric: item.metric,
      label: meta.label,
      unit: meta.unit,
      signed: meta.signed,
      handle: account.handle,
      name: account.name,
      hue: account.hue,
      category: account.category,
      total: item.total,
      series: item.series,
      note: item.note,
    }
  })
}

export function getHallOfRecords(): HallCard[] {
  return [...hallRecords]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((record) => {
      const account = requireAccount(record.handle)
      const meta = metricMeta[record.metric]
      return {
        id: record.id,
        date: record.date,
        dateLabel: formatMonthDay(record.date),
        metric: record.metric,
        label: meta.label,
        handle: account.handle,
        name: account.name,
        hue: account.hue,
        value: record.value,
        signed: meta.signed,
        unit: meta.unit,
        debut: record.debut,
        note: record.note,
      }
    })
}

export function listAccounts(query: AccountQuery): AccountRow[] {
  const saved = new Set(query.saved)
  const filtered = accounts.filter((account) => {
    if (!inTier(account.followers, query.tier)) return false
    if (!inDarkHorse(account.followers, query.darkHorse)) return false
    if (query.savedOnly && !saved.has(account.handle)) return false
    return true
  })
  const sorted = [...filtered].sort((a, b) => {
    const diff = sortValue(a, query.sortKey) - sortValue(b, query.sortKey)
    const directed = query.sortDir === 'asc' ? diff : -diff
    if (directed !== 0) return directed
    return a.handle.localeCompare(b.handle)
  })
  return sorted.map((account) => ({
    handle: account.handle,
    name: account.name,
    hue: account.hue,
    category: account.category,
    city: account.city,
    followers: account.followers,
    impressions: account.impressions,
    posts: account.posts,
    comments: account.comments,
    avgImpressions: averageImpressions(account.impressions, account.posts),
  }))
}

export function getAccount(handle: string): AccountProfile | undefined {
  const key = normalizeHandle(handle)
  const account = accounts.find((item) => item.handle === key)
  if (!account) return undefined

  const ranks: RankLine[] = metricOrder.map((metric) => {
    const ranked = rankAccounts(metric)
    const index = ranked.findIndex((item) => item.handle === account.handle)
    const meta = metricMeta[metric]
    return {
      metric,
      label: meta.label,
      rank: index + 1,
      total: ranked.length,
      value: account[metric],
      signed: meta.signed,
      unit: meta.unit,
    }
  })

  const highlights: Highlight[] = []
  for (const rank of ranks) {
    if (rank.rank <= 5) {
      highlights.push({
        id: `today-${rank.metric}`,
        title: `今日${rank.label} 第 ${rank.rank}`,
        detail: `${formatMonthDay(boardMeta.sampleDay)} · ${displayMetric(rank.metric, rank.value)}`,
      })
    }
  }
  for (const week of weeklyChampions) {
    if (week.handle !== account.handle) continue
    highlights.push({
      id: `week-${week.metric}`,
      title: `近七日${metricMeta[week.metric].label}冠军`,
      detail: `${boardMeta.weekLabel} · ${displayMetric(week.metric, week.total)}`,
    })
  }
  for (const record of hallRecords) {
    if (record.handle !== account.handle) continue
    highlights.push({
      id: record.id,
      title: `${formatMonthDay(record.date)} ${metricMeta[record.metric].label}纪录`,
      detail: record.debut ? `${record.note} 首次登顶。` : record.note,
    })
  }

  return {
    handle: account.handle,
    name: account.name,
    followers: account.followers,
    followerGain: account.followerGain,
    impressions: account.impressions,
    posts: account.posts,
    comments: account.comments,
    avgImpressions: averageImpressions(account.impressions, account.posts),
    category: account.category,
    city: account.city,
    hue: account.hue,
    since: account.since,
    bio: account.bio,
    ranks,
    highlights,
    feed: profilePosts(account),
  }
}

export function searchAccounts(query: string): Account[] {
  const q = normalizeHandle(query)
  if (!q) return []
  return accounts
    .filter((account) => account.handle.includes(q) || account.name.toLowerCase().includes(q))
    .sort((a, b) => searchScore(b, q) - searchScore(a, q) || b.followers - a.followers)
    .slice(0, 8)
}

export function listViralPosts(): PostCard[] {
  return [...viralPosts]
    .sort((a, b) => b.impressions - a.impressions || a.id.localeCompare(b.id))
    .map((post) => {
      const account = requireAccount(post.handle)
      return {
        id: post.id,
        handle: account.handle,
        name: account.name,
        hue: account.hue,
        excerpt: post.excerpt,
        impressions: post.impressions,
        category: post.category,
        time: post.time,
      }
    })
}

export function getPostContributors(): Contributor[] {
  const stats = new Map<string, { count: number; score: number }>()
  for (const post of viralPosts) {
    const current = stats.get(post.handle) ?? { count: 0, score: 0 }
    current.count += 1
    current.score += post.impressions
    stats.set(post.handle, current)
  }
  return [...stats.entries()]
    .map(([handle, stat]) => {
      const account = requireAccount(handle)
      return {
        handle,
        name: account.name,
        hue: account.hue,
        count: stat.count,
        score: stat.score,
        scoreLabel: `${stat.count} 次进入今日热帖`,
      }
    })
    .sort((a, b) => b.count - a.count || b.score - a.score || a.handle.localeCompare(b.handle))
}

export function listTopics(): TopicCard[] {
  return [...topics]
    .sort((a, b) => b.impressions - a.impressions || a.id.localeCompare(b.id))
    .map((topic) => {
      const account = requireAccount(topic.example.handle)
      return {
        id: topic.id,
        name: topic.name,
        category: topic.category,
        impressions: topic.impressions,
        postCount: topic.postCount,
        peopleCount: topic.peopleCount,
        trend: topic.trend,
        trendLabel: trendLabel[topic.trend],
        angles: topic.angles,
        example: {
          handle: account.handle,
          name: account.name,
          hue: account.hue,
          text: topic.example.text,
          impressions: topic.example.impressions,
        },
      }
    })
}

export function listArticles(): ArticleCard[] {
  return [...articles]
    .sort((a, b) => b.bookmarks - a.bookmarks || a.id.localeCompare(b.id))
    .map((article) => {
      const account = requireAccount(article.handle)
      return {
        id: article.id,
        handle: account.handle,
        name: account.name,
        hue: account.hue,
        title: article.title,
        excerpt: article.excerpt,
        bookmarks: article.bookmarks,
        reads: article.reads,
        category: article.category,
        publishedOn: article.publishedOn,
        minutes: article.minutes,
      }
    })
}

export function getArticleContributors(): Contributor[] {
  const stats = new Map<string, { count: number; score: number }>()
  for (const article of articles) {
    const current = stats.get(article.handle) ?? { count: 0, score: 0 }
    current.count += 1
    current.score += article.bookmarks
    stats.set(article.handle, current)
  }
  return [...stats.entries()]
    .map(([handle, stat]) => {
      const account = requireAccount(handle)
      return {
        handle,
        name: account.name,
        hue: account.hue,
        count: stat.count,
        score: stat.score,
        scoreLabel: `${stat.count} 篇上榜长文`,
      }
    })
    .sort((a, b) => b.count - a.count || b.score - a.score || a.handle.localeCompare(b.handle))
}

export function getTeasers(): Teaser[] {
  const topAccount = listAccounts({
    tier: 'all',
    darkHorse: 'off',
    sortKey: 'followers',
    sortDir: 'desc',
    savedOnly: false,
    saved: [],
  })[0]
  const topPost = listViralPosts()[0]
  const topTopic = listTopics()[0]
  const topArticle = listArticles()[0]
  return [
    {
      to: '/accounts',
      kicker: '账号榜',
      title: '按体量往下看',
      detail: topAccount ? `粉丝最多的是 ${topAccount.name}` : '样本账号',
    },
    {
      to: '/posts',
      kicker: '推文榜',
      title: '过去二十四小时的热帖',
      detail: topPost ? `${topPost.name}的一则被看到 ${formatCount(topPost.impressions)} 次` : '样本热帖',
    },
    {
      to: '/topics',
      kicker: '话题榜',
      title: '正在被写成什么',
      detail: topTopic ? `${topTopic.name} · ${topTopic.trendLabel}` : '样本话题',
    },
    {
      to: '/articles',
      kicker: '长文榜',
      title: '被收进书签的长文',
      detail: topArticle ? topArticle.title : '样本长文',
    },
  ]
}

export function normalizeHandle(value: string): string {
  return value.trim().toLowerCase().replace(/^@/, '')
}

function profilePosts(account: Account): ProfilePost[] {
  const items: ProfilePost[] = []
  const posts = viralPosts
    .filter((post) => post.handle === account.handle)
    .sort((a, b) => b.impressions - a.impressions)
  for (const post of posts) {
    items.push({
      id: post.id,
      kind: '热帖',
      title: post.category,
      text: post.excerpt,
      stat: `曝光 ${formatCount(post.impressions)}`,
      when: `${formatMonthDay(boardMeta.sampleDay)} ${post.time}`,
    })
  }
  const longs = articles
    .filter((article) => article.handle === account.handle)
    .sort((a, b) => b.bookmarks - a.bookmarks)
  for (const article of longs) {
    items.push({
      id: article.id,
      kind: '长文',
      title: article.title,
      text: article.excerpt,
      stat: `收藏 ${formatCount(article.bookmarks)}`,
      when: `${formatMonthDay(article.publishedOn)} · ${article.minutes} 分钟`,
    })
  }
  account.samples.forEach((sample, index) => {
    items.push({
      id: `${account.handle}-sample-${index}`,
      kind: '近况',
      title: '随手记',
      text: sample,
      stat: '',
      when: '样本摘录',
    })
  })
  return items.slice(0, 5)
}

function rankAccounts(metric: MetricKey): Account[] {
  return [...accounts].sort((a, b) => b[metric] - a[metric] || a.handle.localeCompare(b.handle))
}

function toEntry(account: Account, metric: MetricKey, rank: number) {
  return {
    rank,
    handle: account.handle,
    name: account.name,
    hue: account.hue,
    category: account.category,
    value: account[metric],
  }
}

function displayMetric(metric: MetricKey, value: number): string {
  const meta = metricMeta[metric]
  const amount = meta.signed ? formatSigned(value) : formatCount(value)
  return `${amount} ${meta.unit}`
}

function sortValue(account: Account, key: SortKey): number {
  switch (key) {
    case 'followers':
      return account.followers
    case 'impressions':
      return account.impressions
    case 'posts':
      return account.posts
    case 'comments':
      return account.comments
    case 'avgImpressions':
      return averageImpressions(account.impressions, account.posts)
  }
}

function inTier(followers: number, tier: FollowerTier): boolean {
  switch (tier) {
    case 'all':
      return true
    case 'lt1k':
      return followers < 1_000
    case '1k-10k':
      return followers >= 1_000 && followers < 10_000
    case '10k-100k':
      return followers >= 10_000 && followers < 100_000
    case '100k-1m':
      return followers >= 100_000 && followers < 1_000_000
    case 'gte1m':
      return followers >= 1_000_000
  }
}

function inDarkHorse(followers: number, horse: DarkHorse): boolean {
  switch (horse) {
    case 'off':
      return true
    case 'lt5k':
      return followers < 5_000
    case '5k-10k':
      return followers >= 5_000 && followers < 10_000
  }
}

function searchScore(account: Account, query: string): number {
  if (account.handle === query) return 100
  if (account.handle.startsWith(query)) return 80
  if (account.name.toLowerCase() === query) return 70
  if (account.name.toLowerCase().startsWith(query)) return 60
  return 10
}

function requireAccount(handle: string): Account {
  const account = accounts.find((item) => item.handle === handle)
  if (!account) throw new Error(`样本缺少账号 @${handle}`)
  return account
}
