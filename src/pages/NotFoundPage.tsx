import { Link } from 'react-router'
import { EmptyState } from '../components/EmptyState.tsx'
import { usePageTitle } from '../lib/title.ts'

export default function NotFoundPage() {
  usePageTitle('未找到页面')
  return (
    <div className="shell page">
      <EmptyState
        heading="h1"
        kicker="404"
        title="这页不在目录里"
        body="地址可能写错了。今日四榜、账号、推文、话题和长文都还在。"
        actions={
          <>
            <Link className="text-btn" to="/">
              回到今日
            </Link>
            <Link className="text-btn" to="/accounts">
              去账号榜
            </Link>
          </>
        }
      />
    </div>
  )
}
