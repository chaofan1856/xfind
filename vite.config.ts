import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type UserConfig } from 'vite'

interface SiteFile {
  name: string
  description: string
  base: string
}

function readSiteFile(): SiteFile {
  const source = readFileSync(new URL('./src/site.config.ts', import.meta.url), 'utf8')
  const pick = (key: string) => {
    const matched = source.match(new RegExp(`\\b${key}:\\s*['"]([^'"]*)['"]`))
    if (!matched?.[1]) throw new Error(`src/site.config.ts 缺少 ${key}`)
    return matched[1]
  }
  return { name: pick('name'), description: pick('description'), base: pick('base') }
}

function normalizeBase(input: string): string {
  const trimmed = input.trim()
  if (!trimmed || trimmed === '/') return '/'
  const withLead = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLead.endsWith('/') ? withLead : `${withLead}/`
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function spaPlugin(base: string, site: SiteFile): Plugin {
  const segments = base === '/' ? 0 : base.split('/').filter(Boolean).length
  const restore =
    '<script>(function(l){if(l.search[1]==="/"){var decoded=l.search.slice(1).split("&").map(function(s){return s.replace(/~and~/g,"&")}).join("?");window.history.replaceState(null,"",l.pathname.slice(0,-1)+decoded+l.hash)}})(window.location)</script>'
  const fallback = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(site.name)}</title>
    <script>
      // GitHub Pages 遇到没有对应文件的路径时会返回这份 404.html。
      // 脚本把 /xfind/account/someone 改写成 /xfind/?/account/someone，
      // 再由 index.html 用 history.replaceState 还原，交给 React Router。
      // pathSegmentsToKeep 等于 base 的路径段数：用户站是 0，项目站 /xfind/ 是 1。
      var pathSegmentsToKeep = ${segments};
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
    <p>正在打开${escapeHtml(site.name)}…</p>
  </body>
</html>
`
  return {
    name: 'github-pages-spa',
    transformIndexHtml(html) {
      const titled = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(site.name)}</title>`)
      const described = titled.replace(
        /<meta name="description" content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${escapeHtml(site.description)}" />`,
      )
      if (described.includes('replaceState')) return described
      return described.replace('<head>', `<head>${restore}`)
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '404.html', source: fallback })
    },
  }
}

function redirectRootPlugin(base: string): Plugin {
  const redirect = (url: string | undefined) => url === '/' || url === '/index.html'
  return {
    name: 'redirect-root-to-base',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!redirect(req.url)) {
          next()
          return
        }
        res.writeHead(302, { Location: base })
        res.end()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!redirect(req.url)) {
          next()
          return
        }
        res.writeHead(302, { Location: base })
        res.end()
      })
    },
  }
}

export default defineConfig((): UserConfig => {
  const site = readSiteFile()
  const fromEnv = process.env.VITE_BASE?.trim()
  const base = fromEnv ? normalizeBase(fromEnv) : normalizeBase(site.base)
  const plugins = [react(), spaPlugin(base, site)]
  if (base !== '/') plugins.push(redirectRootPlugin(base))
  return {
    base,
    plugins,
    server: {
      host: '0.0.0.0',
      port: 43123,
      strictPort: true,
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 43124,
      strictPort: true,
      allowedHosts: true,
    },
  }
})
