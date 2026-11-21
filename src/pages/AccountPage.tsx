import { Link, useParams } from 'react-router'
import { Avatar } from '../components/Avatar.tsx'
import { EmptyState } from '../components/EmptyState.tsx'
import { getAccount, searchAccounts } from '../data/api.ts'
import { copyText } from '../lib/clipboard.ts'
import { formatCount, formatExact, formatSigned } from '../lib/format.ts'
import { accountUrl } from '../lib/router.ts'
import { usePageTitle } from '../lib/title.ts'
import { useAnnounce } from '../lib/useAnnounce.ts'
import { useSavedAccounts } from '../lib/useSavedAccounts.ts'

export default function AccountPage() {
  const params = useParams()
  const rawHandle = params.handle ?? ''
  const profile = getAccount(rawHandle)
  usePageTitle(profile ? profile.name : '未找到账号')
  const { toggle, has } = useSavedAccounts()
  const { notice, announce } = useAnnounce()

  if (!profile) {
    const suggestions = searchAccounts(rawHandle).slice(0, 3)
    return (
      <div className="shell page">
        <EmptyState
          heading="h1"
          kicker="账号"
          title="样本里没有这个账号"
          body={`@${rawHandle || '…'} 不在这份虚构样本中。可以换一个句柄，或回到账号榜。`}
          actions={
            <Link className="text-btn" to="/accounts">
              看全部账号
            </Link>
          }
        />
        {suggestions.length > 0 ? (
          <div className="suggest">
            <h2>接近的名字</h2>
            <ul>
              {suggestions.map((account) => (
                <li key={account.handle}>
                  <Link to={`/account/${account.handle}`}>
                    {account.name} @{account.handle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    )
  }

  const saved = has(profile.handle)

  return (
    <div className="shell page">
      <p className="sr-only" aria-live="polite">
        {notice}
      </p>
      <article className="profile">
        <Link className="back-link" to="/accounts">
          返回账号榜
        </Link>
        <header className="profile-id">
          <Avatar name={profile.name} hue={profile.hue} size={76} />
          <div>
            <p className="kicker">
              {profile.category} · {profile.city} · {profile.since} 年起
            </p>
            <h1>{profile.name}</h1>
            <p className="account-handle">@{profile.handle}</p>
            <p className="lede">{profile.bio}</p>
            <div className="row-actions">
              <button
                type="button"
                className={saved ? 'text-btn is-saved' : 'text-btn'}
                aria-pressed={saved}
                onClick={() => {
                  toggle(profile.handle)
                  announce(saved ? `已取消收藏 ${profile.name}` : `已收藏 ${profile.name}`)
                }}
              >
                {saved ? '已收藏' : '收藏'}
              </button>
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  void copyText(accountUrl(profile.handle)).then((ok) => {
                    announce(ok ? `已复制 @${profile.handle} 的链接` : '没能复制链接')
                  })
                }}
              >
                复制链接
              </button>
            </div>
          </div>
        </header>

        <section className="stat-grid" aria-label="关键数字">
          <Stat label="粉丝" value={formatCount(profile.followers)} exact={profile.followers} />
          <Stat label="今日曝光" value={formatCount(profile.impressions)} exact={profile.impressions} />
          <Stat label="今日发帖" value={formatCount(profile.posts)} exact={profile.posts} />
          <Stat label="今日评论" value={formatCount(profile.comments)} exact={profile.comments} />
          <Stat label="今日涨粉" value={formatSigned(profile.followerGain)} exact={profile.followerGain} />
          <Stat label="篇均曝光" value={formatCount(profile.avgImpressions)} exact={profile.avgImpressions} />
        </section>

        <section aria-labelledby="rank-heading">
          <h2 id="rank-heading">今日名次</h2>
          <ol className="rank-strip">
            {profile.ranks.map((rank) => (
              <li key={rank.metric}>
                <span>{rank.label}</span>
                <strong className="num">第 {rank.rank}</strong>
                <span className="account-handle">共 {rank.total} 人</span>
              </li>
            ))}
          </ol>
        </section>

        {profile.highlights.length > 0 ? (
          <section aria-labelledby="highlight-heading">
            <h2 id="highlight-heading">近期亮点</h2>
            <ul className="highlight-list">
              {profile.highlights.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="posts-heading">
          <h2 id="posts-heading">样本帖文</h2>
          <ol className="sample-list">
            {profile.feed.map((post) => (
              <li key={post.id}>
                <p className="kicker">{post.kind}</p>
                <h3>{post.title}</h3>
                <p>{post.text}</p>
                <p className="post-meta">{[post.stat, post.when].filter(Boolean).join(' · ')}</p>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </div>
  )
}

function Stat({ label, value, exact }: { label: string; value: string; exact: number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong className="num" title={formatExact(exact)}>
        {value}
      </strong>
    </div>
  )
}
