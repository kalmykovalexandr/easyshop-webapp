import { Link, Route, Routes } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import ShopPage from '../features/products/pages/Shop'
import AccountPage from '../features/auth/pages/Account'
import AdminPage from '../features/admin/pages/Admin'
import SuccessPage from '../features/purchases/pages/Success'
import AuthCallback from '../features/auth/pages/AuthCallback'

function Header() {
  const auth = useAuth()
  const { t } = useTranslation()

  const role = auth.user?.profile?.role || auth.user?.profile?.roles?.[0]

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #eee', padding: 12 }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <strong style={{ marginRight: 12 }}>EasyShop</strong>
        <Link to="/shop">{t('nav.shop', '???????')}</Link>
        <Link to="/account">{t('nav.account', '???????')}</Link>
        <Link to="/admin">{t('nav.admin', '???????')}</Link>
        {auth.isAuthenticated && (
          <span style={{ marginLeft: 'auto', color: '#555' }}>
            {auth.user?.profile?.email ?? auth.user?.profile?.preferred_username} {role ? `(${role})` : ''}
          </span>
        )}
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Header />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<ShopPage />} />
        </Routes>
      </main>
    </div>
  )
}
