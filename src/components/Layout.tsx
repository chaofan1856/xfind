import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { siteConfig } from '../site.config.ts'
import { RouteErrorBoundary } from './RouteErrorBoundary.tsx'
import { SearchBox } from './SearchBox.tsx'

const links = [
  { to: '/', label: '今日', end: true },
  { to: '/accounts', label: '账号榜', end: false },
  { to: '/posts', label: '推文榜', end: false },
  { to: '/topics', label: '话题榜', end: false },
  { to: '/articles', label: '长文榜', end: false },
]

export default function Layout() {
  const location = useLocation()
  const [navPath, setNavPath] = useState<string | null>(null)
  const navOpen = navPath === location.pathname

  return (
    <>
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <header className="site-header">
        <div className="shell header-inner">
          <NavLink to="/" className="brand" end>
            <span className="seal" aria-hidden="true">
              榜
            </span>
            <span className="brand-text">
              <span className="brand-kicker">{siteConfig.nameEn}</span>
              <span className="brand-name">{siteConfig.name}</span>
            </span>
          </NavLink>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            onClick={() => setNavPath(navOpen ? null : location.pathname)}
          >
            {navOpen ? '关闭' : '目录'}
          </button>
          <nav id="site-nav" className={navOpen ? 'site-nav is-open' : 'site-nav'} aria-label="主要">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <SearchBox />
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <RouteErrorBoundary key={location.pathname}>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div>
            <p className="brand-name">{siteConfig.name}</p>
            <p className="footer-note">虚构样本 · 北京时间 08:00 截稿 · 静态站点</p>
          </div>
          <nav className="footer-nav" aria-label="页脚">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}
