import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import { routerBasename } from './lib/router.ts'
import AccountPage from './pages/AccountPage.tsx'
import AccountsPage from './pages/AccountsPage.tsx'
import ArticlesPage from './pages/ArticlesPage.tsx'
import HomePage from './pages/HomePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import PostsPage from './pages/PostsPage.tsx'
import TopicsPage from './pages/TopicsPage.tsx'

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="words" element={<Navigate to="/topics" replace />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="account/:handle" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
