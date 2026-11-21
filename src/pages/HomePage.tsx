import { Link } from 'react-router'
import { ChampionCard } from '../components/ChampionCard.tsx'
import { Avatar } from '../components/Avatar.tsx'
import { getBoardMeta, getDailyBoards, getHallOfRecords, getTeasers, getWeeklyBoards } from '../data/api.ts'
import { formatCount, formatExact, formatSigned } from '../lib/format.ts'
import { usePageTitle } from '../lib/title.ts'
import { siteConfig } from '../site.config.ts'

export default function HomePage() {
  usePageTitle()
  const meta = getBoardMeta()
  const boards = getDailyBoards()
  const weekly = getWeeklyBoards()
  const records = getHallOfRecords()
  const teasers = getTeasers()

  return (
    <div className="shell home">
      <header className="masthead">
        <div className="masthead-copy">
          <p className="kicker">样本日 {meta.editionMonth}{meta.editionDay}日 · {meta.editionName}</p>
          <h1>{siteConfig.tagline}</h1>
          <p className="lede">
            统计窗 {meta.windowLabel}（{meta.timezone}）。四张冠军榜只看这一日：发帖、评论、涨粉、曝光。
          </p>
        </div>
        <aside className="edition" aria-label="样本日期">
          <p className="edition-year">{meta.editionYear}</p>
          <p className="edition-day num">{meta.editionDay}</p>
          <p className="edition-month">
            {meta.editionMonth}
            <span>{meta.editionName}</span>
          </p>
        </aside>
      </header>

      <ul className="ticker">
        {boards.map((board) => {
          const winner = board.entries[0]
          if (!winner) return null
          return (
            <li key={board.metric}>
              <Link to={`/account/${winner.handle}`}>
                <span className="ticker-label">{board.label}</span>
                {winner.name}
                <span className="num">
                  {board.signed ? formatSigned(winner.value) : formatCount(winner.value)}
                  {board.unit}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      <section className="section" aria-labelledby="daily-heading">
        <div className="section-head">
          <h2 id="daily-heading">
            <span className="section-index">壹</span>今日四榜
          </h2>
          <p className="section-aside">{meta.windowLabel}</p>
        </div>
        <div className="board-grid">
          {boards.map((board) => (
            <ChampionCard key={board.metric} board={board} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="week-heading">
        <div className="section-head">
          <h2 id="week-heading">
            <span className="section-index">贰</span>近七日冠军
          </h2>
          <p className="section-aside">{meta.weekLabel} · 从左到右</p>
        </div>
        <div className="week-grid">
          {weekly.map((board) => (
            <article key={board.metric} className="week-card">
              <p className="kicker">{board.label}</p>
              <Link className="week-who" to={`/account/${board.handle}`}>
                <Avatar name={board.name} hue={board.hue} size={40} />
                <span>
                  <span className="who-name">{board.name}</span>
                  <span className="who-handle">@{board.handle}</span>
                </span>
              </Link>
              <p className="week-total">
                <strong className="num" title={formatExact(board.total)}>
                  {board.signed ? formatSigned(board.total) : formatCount(board.total)}
                </strong>
                <span className="unit">{board.unit}</span>
              </p>
              <p className="week-note">{board.note}</p>
              <div className="bars" aria-hidden="true">
                {board.series.map((value, index) => {
                  const max = Math.max(...board.series)
                  return (
                    <span
                      key={`${board.metric}-${meta.weekDates[index]}`}
                      className="bar"
                      style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
                      title={`${meta.weekDates[index]} ${value}`}
                    />
                  )
                })}
              </div>
              <p className="sr-only">
                {board.series.map((value, index) => `${meta.weekDates[index]} ${value}`).join('，')}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="hall-heading">
        <div className="section-head">
          <h2 id="hall-heading">
            <span className="section-index">叁</span>纪录殿堂
          </h2>
          <p className="section-aside">过去的单日高点</p>
        </div>
        <div className="hall-layout">
          <ol className="record-list">
            {records.map((record) => (
              <li key={record.id} className="record">
                <time dateTime={record.date}>{record.dateLabel}</time>
                <span className="record-board">{record.label}</span>
                <Link to={`/account/${record.handle}`} className="record-who">
                  <Avatar name={record.name} hue={record.hue} size={28} />
                  <span>{record.name}</span>
                  {record.debut ? <span className="debut">首次登顶</span> : null}
                </Link>
                <span className="record-value num" title={formatExact(record.value)}>
                  {record.signed ? formatSigned(record.value) : formatCount(record.value)}
                  <span className="unit">{record.unit}</span>
                </span>
                <p className="record-note">{record.note}</p>
              </li>
            ))}
          </ol>
          <aside className="sponsor" aria-label="赞助位">
            <p className="kicker">赞助位</p>
            <h3>这里空着</h3>
            <p>榜单先不放广告。这个位置留给以后一位愿意公开支持的伙伴，目前不代表任何广告主。</p>
          </aside>
        </div>
      </section>

      <section className="section" aria-labelledby="more-heading">
        <div className="section-head">
          <h2 id="more-heading">
            <span className="section-index">肆</span>接着看
          </h2>
        </div>
        <div className="teaser-grid">
          {teasers.map((teaser) => (
            <Link key={teaser.to} to={teaser.to} className="teaser">
              <span className="kicker">{teaser.kicker}</span>
              <span className="teaser-title">{teaser.title}</span>
              <span className="teaser-detail">{teaser.detail}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="fine-print">
        样本数据为虚构创作，只用于演示产品结构，不对应任何真实账号或排名。概念上的「一日」在 {meta.timezone}{' '}
        {meta.cutoff} 截稿：样本日 {meta.sampleDay} 覆盖的是前一日 {meta.cutoff} 到当日 {meta.cutoff}。
      </p>
    </div>
  )
}
