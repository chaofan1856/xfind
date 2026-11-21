/** React Router 的 basename 不带末尾斜线；Vite 的 BASE_URL 带着。 */
export function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (!base || base === '/') return undefined
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export function accountUrl(handle: string): string {
  const path = `${import.meta.env.BASE_URL}account/${handle}`
  return new URL(path, window.location.origin).toString()
}
