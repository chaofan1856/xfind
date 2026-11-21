const STORAGE_KEY = 'huayu-creator-board:saved'

export function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

export function writeSaved(handles: readonly string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handles))
  } catch {
    // 隐私模式或配额满时，收藏只留在当前内存里。
  }
}
