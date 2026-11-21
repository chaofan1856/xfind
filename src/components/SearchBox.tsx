import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { normalizeHandle, searchAccounts } from '../data/api.ts'
import type { Account } from '../types.ts'

export function SearchBox() {
  const navigate = useNavigate()
  const location = useLocation()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState({ path: location.pathname, query: '', open: false, active: 0 })
  const query = draft.path === location.pathname ? draft.query : ''
  const open = draft.path === location.pathname ? draft.open : false
  const active = draft.path === location.pathname ? draft.active : 0
  const results = query.trim() ? searchAccounts(query) : []
  const panelOpen = open && query.trim().length > 0

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setDraft((current) => ({ ...current, path: location.pathname, open: false }))
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [location.pathname])

  function go(handle: string) {
    setDraft({ path: location.pathname, query: '', open: false, active: 0 })
    void navigate(`/account/${handle}`)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const normalized = normalizeHandle(query)
    const exact = results.find((item) => item.handle === normalized)
    const chosen = exact ?? results[active] ?? results[0]
    if (chosen) go(chosen.handle)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setDraft((current) => ({
        path: location.pathname,
        query,
        open: true,
        active: Math.min((current.path === location.pathname ? current.active : 0) + 1, Math.max(results.length - 1, 0)),
      }))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setDraft((current) => ({
        path: location.pathname,
        query,
        open: true,
        active: Math.max((current.path === location.pathname ? current.active : 0) - 1, 0),
      }))
    } else if (event.key === 'Escape') {
      setDraft((current) => ({ ...current, path: location.pathname, open: false }))
    }
  }

  return (
    <div className="search" ref={rootRef}>
      <form role="search" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="site-search">
          搜索创作者名字或句柄
        </label>
        <input
          id="site-search"
          className="search-input"
          role="combobox"
          aria-expanded={panelOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="搜索名字或 @handle"
          value={query}
          onChange={(event) => {
            setDraft({ path: location.pathname, query: event.target.value, open: true, active: 0 })
          }}
          onFocus={() => setDraft((current) => ({ ...current, path: location.pathname, query, open: true }))}
          onKeyDown={onKeyDown}
        />
      </form>
      {panelOpen ? (
        <div className="search-panel" id={listId}>
          {results.length === 0 ? (
            <p className="search-empty">样本里没有这个账号</p>
          ) : (
            <ul role="listbox" aria-label="匹配的创作者">
              {results.map((account, index) => (
                <li key={account.handle} role="presentation">
                  <SearchOption account={account} active={index === active} onChoose={go} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}

function SearchOption({
  account,
  active,
  onChoose,
}: {
  account: Account
  active: boolean
  onChoose: (handle: string) => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      className={active ? 'search-option is-current' : 'search-option'}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onChoose(account.handle)}
    >
      <span className="account-name">{account.name}</span>
      <span className="account-handle">@{account.handle}</span>
    </button>
  )
}
