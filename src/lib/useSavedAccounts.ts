import { useCallback, useState } from 'react'
import { readSaved, writeSaved } from './saved.ts'

export function useSavedAccounts() {
  const [saved, setSaved] = useState<string[]>(() => readSaved())

  const toggle = useCallback((handle: string) => {
    setSaved((current) => {
      const next = current.includes(handle) ? current.filter((item) => item !== handle) : [...current, handle]
      writeSaved(next)
      return next
    })
  }, [])

  const has = useCallback((handle: string) => saved.includes(handle), [saved])

  return { saved, toggle, has }
}
