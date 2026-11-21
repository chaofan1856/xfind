import { accounts } from '../src/data/accounts.ts'
import { articles } from '../src/data/articles.ts'
import { boardMeta } from '../src/data/meta.ts'
import { viralPosts } from '../src/data/posts.ts'
import { hallRecords } from '../src/data/records.ts'
import { topics } from '../src/data/topics.ts'
import { weeklyChampions } from '../src/data/weekly.ts'
import {
  getArticleContributors,
  getDailyBoards,
  getHallOfRecords,
  getPostContributors,
  getWeeklyBoards,
  listAccounts,
  listArticles,
  listTopics,
  listViralPosts,
} from '../src/data/api.ts'
import { formatCount, formatSigned } from '../src/lib/format.ts'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

const handles = new Set(accounts.map((account) => account.handle))
assert(handles.size === accounts.length, '句柄重复')
assert(accounts.length >= 30, '账号不足 30')
assert(viralPosts.length >= 20, '热帖不足 20')
assert(topics.length >= 8, '话题不足 8')
assert(articles.length >= 15, '长文不足 15')
assert(new Set(hallRecords.map((record) => record.date)).size >= 10, '纪录日不足 10')
assert(boardMeta.weekDates.length === 7, '七日刻度不是 7 天')

for (const account of accounts) {
  assert(/^[a-z][a-z0-9_]{2,24}$/.test(account.handle), `句柄不合法 ${account.handle}`)
  assert(account.samples.length >= 2, `${account.handle} 缺少样本句`)
  assert(account.posts > 0, `${account.handle} 发帖为 0`)
}

const impressionByHandle = new Map<string, number>()
for (const post of viralPosts) {
  assert(handles.has(post.handle), `热帖作者不存在 ${post.handle}`)
  impressionByHandle.set(post.handle, (impressionByHandle.get(post.handle) ?? 0) + post.impressions)
}
for (const [handle, total] of impressionByHandle) {
  const account = accounts.find((item) => item.handle === handle)
  assert(account && total <= account.impressions, `${handle} 的热帖曝光超过了当日合计`)
}

for (const topic of topics) {
  assert(topic.angles.length >= 2 && topic.angles.length <= 3, `${topic.id} 角度数量不对`)
  assert(handles.has(topic.example.handle), `话题样本作者不存在 ${topic.example.handle}`)
}
for (const article of articles) assert(handles.has(article.handle), `长文作者不存在 ${article.handle}`)
for (const record of hallRecords) assert(handles.has(record.handle), `纪录作者不存在 ${record.handle}`)

for (const week of weeklyChampions) {
  assert(handles.has(week.handle), `七日冠军不存在 ${week.handle}`)
  assert(week.series.length === 7, `${week.metric} 序列不是 7 天`)
  const sum = week.series.reduce((total, value) => total + value, 0)
  assert(sum === week.total, `${week.metric} 七日合计 ${sum} != ${week.total}`)
}

const daily = getDailyBoards()
const expectDaily: Record<string, string> = {
  posts: 'qingherili',
  comments: 'xubanxia',
  followerGain: 'handu_lab',
  impressions: 'suwanbai',
}
for (const board of daily) {
  assert(board.entries.length === 5, `${board.metric} 不是前五`)
  assert(board.entries[0]?.handle === expectDaily[board.metric], `${board.metric} 冠军不对`)
}

const weekly = getWeeklyBoards()
const expectWeekly: Record<string, string> = {
  posts: 'linchengchuan',
  comments: 'xubanxia',
  followerGain: 'handu_lab',
  impressions: 'suwanbai',
}
for (const board of weekly) {
  assert(board.handle === expectWeekly[board.metric], `${board.metric} 七日冠军不对`)
}

assert(listViralPosts().length === viralPosts.length, '热帖列表丢了')
assert(listTopics().length === topics.length, '话题列表丢了')
assert(listArticles()[0]?.handle === 'shenzhishang', '长文第一不是按收藏排的')
assert(getHallOfRecords()[0]?.date === '2026-11-18', '纪录没有按日期倒序')
assert(getPostContributors()[0]?.handle === 'suwanbai', '热帖贡献第一不对')
assert(getArticleContributors()[0]?.count === 2, '长文贡献统计不对')

const tiers = ['lt1k', '1k-10k', '10k-100k', '100k-1m', 'gte1m'] as const
for (const tier of tiers) {
  assert(listAccounts({ tier, darkHorse: 'off', sortKey: 'followers', sortDir: 'desc', savedOnly: false, saved: [] }).length > 0, `${tier} 为空`)
}
for (const darkHorse of ['lt5k', '5k-10k'] as const) {
  assert(
    listAccounts({ tier: 'all', darkHorse, sortKey: 'followers', sortDir: 'desc', savedOnly: false, saved: [] }).length > 0,
    `${darkHorse} 为空`,
  )
}

assert(formatCount(6840) === '6,840', formatCount(6840))
assert(formatCount(6_420_000) === '642万', formatCount(6_420_000))
assert(formatCount(1_842_000) === '184.2万', formatCount(1_842_000))
assert(formatCount(1_102_300) === '110.2万', formatCount(1_102_300))
assert(formatSigned(6840) === '+6,840', formatSigned(6840))

console.log(`样本通过：${accounts.length} 个账号，${viralPosts.length} 则热帖，${topics.length} 个话题，${articles.length} 篇长文，${hallRecords.length} 条纪录。`)
