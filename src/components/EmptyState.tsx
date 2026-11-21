import type { ReactNode } from 'react'

interface EmptyStateProps {
  kicker?: string
  title: string
  body: string
  actions?: ReactNode
  heading?: 'h1' | 'h2'
}

export function EmptyState({ kicker = '空状态', title, body, actions, heading = 'h2' }: EmptyStateProps) {
  const Title = heading
  return (
    <div className="empty">
      <p className="kicker">{kicker}</p>
      <Title>{title}</Title>
      <p>{body}</p>
      {actions ? <div className="empty-actions">{actions}</div> : null}
    </div>
  )
}
