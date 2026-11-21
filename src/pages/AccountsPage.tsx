import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../components/Avatar.tsx'
import { EmptyState } from '../components/EmptyState.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { getBoardMeta, listAccounts } from '../data/api.ts'
import { copyText } from '../lib/clipboard.ts'
import { formatCount, formatExact } from '../lib/format.ts'
import { accountUrl } from '../lib/router.ts'
import { usePageTitle } from '../lib/title.ts'
import { useAnnounce } from '../lib/useAnnounce.ts'
import { useSavedAccounts } from '../lib/useSavedAccounts.ts'
import type { AccountRow, DarkHorse, FollowerTier, SortDir, SortKey } from '../types.ts'

const tiers: { id: FollowerTier; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'lt1k', label: '1千以下' },
  { id: '1k-10k', label: '1千-1万' },
  { id: '10k-100k', label: '1万-10万' },
  { id: '100k-1m', label: '10万-100万' },
  { id: 'gte1m', label: '100万+' },
]

const horses: { id: DarkHorse; label: string }[] = [
  { id: 'off', label: '不限' },
  { id: 'lt5k', label: '五千以下' },
  { id: '5k-10k', label: '五千至一万' },
]

const sorts: { id: SortKey; label: string }[] = [
  { id: 'followers', label: '粉丝' },
  { id: 'impressions', label: '曝光' },
  { id: 'posts', label: '发帖' },
  { id: 'comments', label: '评论' },
  { id: 'avgImpressions', label: '篇均曝光' },
]

export default function AccountsPage() {
  usePageTitle('账号榜')
  const meta = getBoardMeta()
  const { saved, toggle, has } = useSavedAccounts()
  const { notice, announce } = useAnnounce()
  const [tier, setTier] = useState<FollowerTier>('all')
  const [darkHorse, setDarkHorse] = useState<DarkHorse>('off')
  const [sortKey, setSortKey] = useState<SortKey>('followers')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [savedOnly, setSavedOnly] = useState(false)

  const rows = useMemo(
    () => listAccounts({ tier, darkHorse, sortKey, sortDir, savedOnly, saved }),
    [tier, darkHorse, sortKey, sortDir, savedOnly, saved],
  )

  function changeSort(next: SortKey) {
    if (next === sortKey) {
      setSortDir((dir) => (dir === 'desc' ? 'asc' : 'desc'))
      return
    }
    setSortKey(next)
    setSortDir('desc')
  }

  async function share(row: AccountRow) {
    const ok = await copyText(accountUrl(row.handle))
    announce(ok ? `已复制 @${row.handle} 的链接` : `没能复制 @${row.handle} 的链接`)
  }

  return (
    <div className="shell page">
      <PageHeader
        kicker={`样本日 ${meta.windowLabel}`}
        title="账号榜"
        lede="按粉丝体量筛选，也可以只看五千粉以下和五千到一万的黑马。收藏和分享都留在这台浏览器里。"
      />

      <div className="filters">
        <div className="filter-block">
          <p className="filter-label" id="tier-label">
            粉丝体量
          </p>
          <div className="chip-row" role="group" aria-labelledby="tier-label">
            {tiers.map((item) => (
              <button
                key={item.id}
                type="button"
                className="chip"
                aria-pressed={tier === item.id}
                onClick={() => setTier(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-block">
          <p className="filter-label" id="horse-label">
            黑马
          </p>
          <div className="chip-row" role="group" aria-labelledby="horse-label">
            {horses.map((item) => (
              <button
                key={item.id}
                type="button"
                className="chip"
                aria-pressed={darkHorse === item.id}
                onClick={() => setDarkHorse(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="toolbar">
        <p className="result-count">
          {rows.length} 个账号
          {savedOnly ? ' · 只看收藏' : ''}
        </p>
        <label className="sort-select">
          <span>排序</span>
          <select
            value={`${sortKey}:${sortDir}`}
            onChange={(event) => {
              const [key, dir] = event.target.value.split(':') as [SortKey, SortDir]
              setSortKey(key)
              setSortDir(dir)
            }}
          >
            {sorts.flatMap((item) => [
              <option key={`${item.id}:desc`} value={`${item.id}:desc`}>
                {item.label} 从高到低
              </option>,
              <option key={`${item.id}:asc`} value={`${item.id}:asc`}>
                {item.label} 从低到高
              </option>,
            ])}
          </select>
        </label>
        <button type="button" className="text-btn" aria-pressed={savedOnly} onClick={() => setSavedOnly((value) => !value)}>
          {savedOnly ? '显示全部' : `只看收藏${saved.length ? `（${saved.length}）` : ''}`}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {notice}
      </p>

      {rows.length === 0 ? (
        <EmptyState
          title="没有对上的账号"
          body="这个体量和黑马条件没有交集，或收藏夹里还没有符合的人。"
          actions={
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                setTier('all')
                setDarkHorse('off')
                setSavedOnly(false)
              }}
            >
              清除筛选
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="rank-table">
            <caption className="sr-only">账号榜，可按粉丝、曝光、发帖、评论和篇均曝光排序</caption>
            <thead>
              <tr>
                <th scope="col">名次</th>
                <th scope="col">账号</th>
                {sorts.map((item) => {
                  const active = sortKey === item.id
                  return (
                    <th key={item.id} scope="col" aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                      <button
                        type="button"
                        className="sort-btn"
                        onClick={() => changeSort(item.id)}
                        aria-label={`按${item.label}${active && sortDir === 'asc' ? '升序' : '降序'}排序`}
                      >
                        {item.label}
                        {active ? <span aria-hidden="true">{sortDir === 'asc' ? ' ↑' : ' ↓'}</span> : null}
                      </button>
                    </th>
                  )
                })}
                <th scope="col">动作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const savedRow = has(row.handle)
                return (
                  <tr key={row.handle}>
                    <td className="num rank-cell" data-label="名次">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="account-cell" data-label="账号">
                      <Link className="account-line" to={`/account/${row.handle}`}>
                        <Avatar name={row.name} hue={row.hue} size={40} />
                        <span>
                          <span className="account-name">{row.name}</span>
                          <span className="account-handle">
                            @{row.handle} · {row.category} · {row.city}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <MetricCell label="粉丝" value={row.followers} />
                    <MetricCell label="曝光" value={row.impressions} />
                    <MetricCell label="发帖" value={row.posts} />
                    <MetricCell label="评论" value={row.comments} />
                    <MetricCell label="篇均曝光" value={row.avgImpressions} />
                    <td className="actions-cell" data-label="动作">
                      <div className="row-actions">
                        <button
                          type="button"
                          className={savedRow ? 'text-btn is-saved' : 'text-btn'}
                          aria-pressed={savedRow}
                          aria-label={savedRow ? `取消收藏 ${row.name}` : `收藏 ${row.name}`}
                          onClick={() => {
                            toggle(row.handle)
                            announce(savedRow ? `已取消收藏 ${row.name}` : `已收藏 ${row.name}`)
                          }}
                        >
                          {savedRow ? '已收藏' : '收藏'}
                        </button>
                        <button type="button" className="text-btn" onClick={() => void share(row)}>
                          分享
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function MetricCell({ label, value }: { label: string; value: number }) {
  return (
    <td className="num" data-label={label} title={formatExact(value)}>
      {formatCount(value)}
    </td>
  )
}
