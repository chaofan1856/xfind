import { useCallback, useEffect, useRef, useState } from 'react'

export function useAnnounce() {
  const [notice, setNotice] = useState('')
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  const announce = useCallback((message: string) => {
    setNotice(message)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setNotice(''), 2200)
  }, [])

  return { notice, announce }
}
