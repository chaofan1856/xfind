export function formatCount(value: number): string {
  const negative = value < 0
  const abs = Math.abs(value)
  const body = abs >= 100_000_000 ? `${trim(abs / 100_000_000)}亿` : abs >= 10_000 ? `${trim(abs / 10_000)}万` : group(abs)
  return negative ? `-${body}` : body
}

export function formatSigned(value: number): string {
  if (value > 0) return `+${formatCount(value)}`
  if (value < 0) return formatCount(value)
  return '0'
}

export function formatExact(value: number): string {
  const negative = value < 0
  const body = group(Math.abs(value))
  return negative ? `-${body}` : body
}

export function averageImpressions(impressions: number, posts: number): number {
  if (posts <= 0) return 0
  return Math.round(impressions / posts)
}

export function formatMonthDay(isoDate: string): string {
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  return `${Number(parts[1])}月${Number(parts[2])}日`
}

export function formatFullDate(isoDate: string): string {
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  return `${parts[0]}年${Number(parts[1])}月${Number(parts[2])}日`
}

function trim(value: number): string {
  const digits = value >= 1000 ? 0 : 1
  return value.toFixed(digits).replace(/\.0$/, '')
}

function group(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
