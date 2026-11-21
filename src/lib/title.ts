import { useEffect } from 'react'
import { siteConfig } from '../site.config.ts'

export function usePageTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} · ${siteConfig.name}` : `${siteConfig.name} · ${siteConfig.tagline}`
  }, [page])
}
