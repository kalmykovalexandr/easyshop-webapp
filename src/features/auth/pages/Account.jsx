import { useMemo } from 'react'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import { changeLanguage } from '../../../shared/i18n'

import styles from './Account.module.css'

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
    if (!auth.isLoading) {
      auth.signinRedirect({ state: { returnUrl: window.location.pathname } })
    }
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem('easyshop:returnUrl')
    auth.signoutRedirect({ post_logout_redirect_uri: window.location.origin })
  }

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value)
  }

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('account.title')}</h1>
        <label className={styles.languageSelector}>
          <span>{t('account.language')}</span>
          <select value={i18n.language} onChange={handleLanguageChange} className={styles.select}>
            <option value="ru">Russian</option>
            <option value="en">English</option>
          </select>
        </label>
      </header>

      {!auth.isAuthenticated && (
        <div className={styles.card}>
          <p className={styles.message}>{t('account.notAuthorized')}</p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleLogin}
            disabled={auth.isLoading}
          >
            {t('account.login')}
          </button>
        </div>
      )}

      {auth.isAuthenticated && userInfo && (
        <div className={styles.card}>
          <div className={styles.row}>
            <strong>{t('account.email')}:</strong>
            <span>{userInfo.email}</span>
          </div>
          <div className={styles.row}>
            <strong>{t('account.role')}:</strong>
            <span>{userInfo.role}</span>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={handleLogout}>
              {t('account.logout')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
