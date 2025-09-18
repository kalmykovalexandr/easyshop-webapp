import { useMemo } from 'react'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import { changeLanguage } from '../../../shared/i18n'

function getUserInfo(user) {
  if (!user) return null
  const profile = user.profile ?? {}
  const email = profile.email ?? profile.preferred_username ?? user.profile?.sub
  const role = profile.role || profile.roles?.[0] || 'USER'
  return { email, role }
}

export default function AccountPage() {
  const auth = useAuth()
  const { t, i18n } = useTranslation()

  const userInfo = useMemo(() => getUserInfo(auth.user), [auth.user])

  const handleLogin = () => {
    auth.signinRedirect({ state: { returnUrl: window.location.pathname } })
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem('easyshop:returnUrl')
    auth.signoutRedirect()
  }

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value)
  }

  return (
    <section>
      <header style={{ marginBottom: 24 }}>
        <h1>{t('account.title')}</h1>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span>{t('account.language')}</span>
          <select value={i18n.language} onChange={handleLanguageChange}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>
      </header>

      {auth.isLoading && <p>{t('account.loading')}</p>}

      {!auth.isAuthenticated && !auth.isLoading && (
        <div>
          <p>{t('account.notAuthorized')}</p>
          <button onClick={handleLogin}>{t('account.login')}</button>
        </div>
      )}

      {auth.isAuthenticated && userInfo && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <strong>{t('account.email')}:</strong> {userInfo.email}
          </div>
          <div>
            <strong>{t('account.role')}:</strong> {userInfo.role}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleLogout}>{t('account.logout')}</button>
          </div>
        </div>
      )}
    </section>
  )
}
