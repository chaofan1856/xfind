import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty" role="alert">
          <p className="kicker">出错了</p>
          <h1>这一页没有顺利展开</h1>
          <p>刷新之后通常就能回到榜单。样本数据仍在本地。</p>
        </div>
      )
    }
    return this.props.children
  }
}
