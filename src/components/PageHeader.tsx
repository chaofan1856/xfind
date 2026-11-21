interface PageHeaderProps {
  kicker: string
  title: string
  lede: string
}

export function PageHeader({ kicker, title, lede }: PageHeaderProps) {
  return (
    <header className="page-head">
      <p className="kicker">{kicker}</p>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
    </header>
  )
}
