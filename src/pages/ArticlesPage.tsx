import { Link } from 'react-router'
import { Avatar } from '../components/Avatar.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { getArticleContributors, listArticles } from '../data/api.ts'
import { formatCount, formatExact, formatMonthDay } from '../lib/format.ts'
import { usePageTitle } from '../lib/title.ts'

export default function ArticlesPage() {
  usePageTitle('长文榜')
  const articles = listArticles()
  const contributors = getArticleContributors()

  return (
    <div className="shell page">
      <PageHeader
        kicker="按收藏排序"
        title="长文榜"
        lede="读起来需要一点时间的帖子。名次看收藏，不看短帖那种瞬时曝光。旁边是写了多少篇上榜长文。"
      />
      <div className="split-layout">
        <ol className="post-list">
          {articles.map((article, index) => (
            <li key={article.id} className="post-card">
              <span className="post-rank num">{String(index + 1).padStart(2, '0')}</span>
              <div className="post-body">
                <p className="post-kicker">
                  <span>{article.category}</span>
                  <span className="num" title={formatExact(article.bookmarks)}>
                    收藏 {formatCount(article.bookmarks)}
                  </span>
                </p>
                <h2 className="article-title">{article.title}</h2>
                <p className="article-excerpt">{article.excerpt}</p>
                <p className="post-meta">
                  <Link to={`/account/${article.handle}`} className="inline-account">
                    <Avatar name={article.name} hue={article.hue} size={28} />
                    <span>
                      {article.name} @{article.handle}
                    </span>
                  </Link>
                  <span>
                    {formatMonthDay(article.publishedOn)} · {article.minutes} 分钟 · 阅读 {formatCount(article.reads)}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="side-card" aria-labelledby="article-contrib">
          <h2 id="article-contrib">长文贡献</h2>
          <p className="side-note">上榜篇数优先。篇数相同，则比这些长文的收藏合计。</p>
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
