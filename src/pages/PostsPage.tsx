import { Link } from 'react-router'
import { Avatar } from '../components/Avatar.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { getBoardMeta, getPostContributors, listViralPosts } from '../data/api.ts'
import { formatCount, formatExact } from '../lib/format.ts'
import { usePageTitle } from '../lib/title.ts'

export default function PostsPage() {
  usePageTitle('推文榜')
  const meta = getBoardMeta()
  const posts = listViralPosts()
  const contributors = getPostContributors()

  return (
    <div className="shell page">
      <PageHeader
        kicker={`24 小时 · ${meta.windowLabel}`}
        title="推文榜"
        lede="这一窗里曝光最高的帖文。旁边是热门贡献榜：谁更常出现在这份日榜上。"
      />
      <div className="split-layout">
        <ol className="post-list">
          {posts.map((post, index) => (
            <li key={post.id} className="post-card">
              <span className="post-rank num">{String(index + 1).padStart(2, '0')}</span>
              <div className="post-body">
                <p className="post-kicker">
                  <span>{post.category}</span>
                  <span className="num" title={formatExact(post.impressions)}>
                    曝光 {formatCount(post.impressions)}
                  </span>
                </p>
                <p className="post-excerpt">{post.excerpt}</p>
                <p className="post-meta">
                  <Link to={`/account/${post.handle}`} className="inline-account">
                    <Avatar name={post.name} hue={post.hue} size={28} />
                    <span>
                      {post.name} @{post.handle}
                    </span>
                  </Link>
                  <time dateTime={`${meta.sampleDay}T${post.time}`}>
                    {meta.editionMonth}
                    {meta.editionDay}日 {post.time}
                  </time>
                </p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="side-card" aria-labelledby="contrib-heading">
          <h2 id="contrib-heading">热门贡献榜</h2>
          <p className="side-note">按进入今日热帖的次数排序，次数相同则比这些帖的曝光合计。</p>
          <ol className="contributor-list">
            {contributors.map((person, index) => (
              <li key={person.handle}>
                <Link to={`/account/${person.handle}`}>
                  <span className="num">{String(index + 1).padStart(2, '0')}</span>
                  <Avatar name={person.name} hue={person.hue} size={32} />
                  <span>
                    <span className="account-name">{person.name}</span>
                    <span className="account-handle">{person.scoreLabel}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  )
}
