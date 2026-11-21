import { useId, useState } from 'react'
import { Link } from 'react-router'
import type { DailyBoard } from '../types.ts'
import { formatCount, formatExact, formatSigned } from '../lib/format.ts'
import { Avatar } from './Avatar.tsx'

export function ChampionCard({ board }: { board: DailyBoard }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const winner = board.entries[0]
  const rest = board.entries.slice(1)
  if (!winner) return null

  return (
    <article className={`champion champion-${board.metric}`}>
      <header className="champion-head">
        <h3>{board.label}</h3>
        <p>{board.method}</p>
      </header>
      <Link className="champion-top" to={`/account/${winner.handle}`}>
        <span className="rank-num num">01</span>
        <span className="who">
          <Avatar name={winner.name} hue={winner.hue} size={46} />
          <span className="who-copy">
            <span className="who-name">{winner.name}</span>
            <span className="who-handle">@{winner.handle}</span>
            <span className="who-cat">{winner.category}</span>
          </span>
        </span>
        <span className="who-value">
          <strong className="num" title={formatExact(winner.value)}>
            {board.signed ? formatSigned(winner.value) : formatCount(winner.value)}
          </strong>
          <span className="unit">{board.unit}</span>
        </span>
      </Link>
      <button
        type="button"
        className="ghost-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? '收起第 2–5 名' : '展开第 2–5 名'}
      </button>
      {open ? (
        <ol className="runners" id={panelId} start={2}>
          {rest.map((entry) => (
            <li key={entry.handle}>
              <Link to={`/account/${entry.handle}`}>
                <span className="num runner-rank">{String(entry.rank).padStart(2, '0')}</span>
                <Avatar name={entry.name} hue={entry.hue} size={32} />
                <span className="runner-name">{entry.name}</span>
                <span className="runner-value num" title={formatExact(entry.value)}>
                  {board.signed ? formatSigned(entry.value) : formatCount(entry.value)}
                  <span className="unit">{board.unit}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  )
}
