import { existsSync, readFileSync } from 'node:fs'

const index = readFileSync('dist/index.html', 'utf8')
const fallback = readFileSync('dist/404.html', 'utf8')

function fail(message) {
  console.error(message)
  process.exit(1)
}

if (!fallback.includes('var pathSegmentsToKeep = 1;')) {
  fail('404.html 的 pathSegmentsToKeep 应该是 1，对应项目站 /xfind/')
}
if (!index.includes('replaceState')) fail('index.html 缺少把 Pages 回跳还原成路径的脚本')
if (!index.includes('/xfind/assets/')) fail('构建产物的资源路径没有带上 /xfind/')
if (!index.includes('华语创作者榜')) fail('首页标题不是站点名')

const asset = index.match(/\/xfind\/assets\/[^"]+/)?.[0]
if (!asset) fail('没有找到带 base 的脚本或样式')
const file = `dist${asset.replace('/xfind', '')}`
if (!existsSync(file)) fail(`资源文件不存在：${file}`)

console.log('Pages 路径与 404 回退检查通过')
