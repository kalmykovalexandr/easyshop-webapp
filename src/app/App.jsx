import { Suspense, lazy } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import styles from './App.module.css'
import LoadingScreen from '../shared/components/LoadingScreen'

const ShopPage = lazy(() => import('../features/products/pages/Shop'))
const AccountPage = lazy(() => import('../features/auth/pages/Account'))
const AdminPage = lazy(() => import('../features/admin/pages/Admin'))
const SuccessPage = lazy(() => import('../features/purchases/pages/Success'))
const AuthCallback = lazy(() => import('../features/auth/pages/AuthCallback'))

function Header() {
  const auth = useAuth()
  const { t } = useTranslation()

  const role = auth.user?.profile?.role || auth.user?.profile?.roles?.[0]
  const userLabel = auth.user?.profile?.email ?? auth.user?.profile?.preferred_username

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <strong className={styles.brand}>EasyShop</strong>
        <Link to="/shop">{t('nav.shop', 'Shop')}</Link>
        <Link to="/account">{t('nav.account', 'Account')}</Link>
        <Link to="/admin">{t('nav.admin', 'Admin')}</Link>
        {auth.isAuthenticated && (
          <span className={styles.userInfo}>
            {userLabel} {role ? `(${role})` : ''}
          </span>
        )}
      </nav>
    </header>
  )
}

function RouteFallback() {
  const { t } = useTranslation()
  return <LoadingScreen message={t('shop.loading')} />
}

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<ShopPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}