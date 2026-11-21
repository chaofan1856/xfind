import { useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../components/Avatar.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { getBoardMeta, listTopics } from '../data/api.ts'
import { formatCount, formatExact } from '../lib/format.ts'
import { usePageTitle } from '../lib/title.ts'

export default function TopicsPage() {
  usePageTitle('话题榜')
  const meta = getBoardMeta()
  const topics = listTopics()
  const [open, setOpen] = useState<Set<string>>(() => new Set())

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="shell page">
      <PageHeader
        kicker={`24 小时话题 · ${meta.windowLabel}`}
        title="话题榜"
        lede="按曝光排列。展开以后能看到两到三个写作角度，以及一则样本帖。"
      />
      <ul className="legend" aria-label="趋势说明">
        <li>
          <span className="trend trend-rising">上升中</span>还在变热
        </li>
        <li>
          <span className="trend trend-peak">见顶</span>热度停在高处
        </li>
        <li>
          <span className="trend trend-cooling">退烧</span>讨论正在变少
        </li>
      </ul>
      <ol className="topic-list">
        {topics.map((topic, index) => {
          const expanded = open.has(topic.id)
          const panelId = `topic-${topic.id}`
          return (
            <li key={topic.id} className="topic">
              <div className="topic-summary">
                <span className="post-rank num">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{topic.name}</h2>
                  <p className="post-meta">
                    <span>{topic.category}</span>
                    <span>{topic.postCount} 帖</span>
                    <span>{topic.peopleCount} 人</span>
                    <span className="num" title={formatExact(topic.impressions)}>
                      曝光 {formatCount(topic.impressions)}
                    </span>
                  </p>
                </div>
                <span className={`trend trend-${topic.trend}`}>{topic.trendLabel}</span>
                <button
                  type="button"
                  className="ghost-btn"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(topic.id)}
                >
                  {expanded ? '收起' : '展开'}
                </button>
              </div>
              {expanded ? (
                <div className="topic-body" id={panelId}>
                  <div>
                    <h3>可以怎么写</h3>
                    <ol className="angles">
                      {topic.angles.map((angle) => (
                        <li key={angle}>{angle}</li>
                      ))}
                    </ol>
                  </div>
                  <article className="example-card">
                    <p className="kicker">样本帖</p>
                    <p className="post-excerpt">{topic.example.text}</p>
                    <p className="post-meta">
                      <Link to={`/account/${topic.example.handle}`} className="inline-account">
                        <Avatar name={topic.example.name} hue={topic.example.hue} size={28} />
                        <span>
                          {topic.example.name} @{topic.example.handle}
                        </span>
                      </Link>
                      <span className="num" title={formatExact(topic.example.impressions)}>
                        曝光 {formatCount(topic.example.impressions)}
                      </span>
                    </p>
                  </article>
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
