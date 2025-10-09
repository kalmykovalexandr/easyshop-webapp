import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import styles from './App.module.css'
import LoadingScreen from '../shared/components/LoadingScreen'
import RequireAuth from '../features/auth/components/RequireAuth'
import { changeLanguage } from '../shared/i18n'

const ShopPage = lazy(() => import('../features/products/pages/Shop'))
const AccountPage = lazy(() => import('../features/auth/pages/Account'))
const OrdersPage = lazy(() => import('../features/orders/pages/Orders'))
const AdminPage = lazy(() => import('../features/admin/pages/Admin'))
const SuccessPage = lazy(() => import('../features/purchases/pages/Success'))
const AuthCallback = lazy(() => import('../features/auth/pages/AuthCallback'))

function getInitials(profile) {
  if (!profile) {
    return ''
  }
  const segments = [profile.given_name, profile.family_name, profile.name]
    .filter(Boolean)
    .map((value) => value.toString().trim())

  if (segments.length >= 2) {
    return `${segments[0][0] ?? ''}${segments[1][0] ?? ''}`.toUpperCase()
  }

  if (segments.length === 1 && segments[0]) {
    const words = segments[0].split(' ').filter(Boolean)
    if (words.length >= 2) {
      return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase()
    }
    return segments[0].slice(0, 2).toUpperCase()
  }

  const email = profile.email ?? profile.preferred_username
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }

  return ''
}

function UserPlaceholderIcon() {
  return (
    <svg
      className={styles.iconSvg}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5.5 18.5c.9-3.1 3.2-5 6.5-5s5.6 1.9 6.5 5" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a16 16 0 0 1 4 9 16 16 0 0 1-4 9 16 16 0 0 1-4-9 16 16 0 0 1 4-9z" />
    </svg>
  )
}

function Header() {
  const auth = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [hasHover, setHasHover] = useState(false)
  const accountMenuRef = useRef(null)
  const languageMenuRef = useRef(null)
  const accountHoverTimeoutRef = useRef(null)
  const languageHoverTimeoutRef = useRef(null)

  useEffect(() => {
    setAccountMenuOpen(false)
  }, [auth.isAuthenticated])

  useEffect(() => {
    setLanguageMenuOpen(false)
  }, [i18n.language])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    setHasHover(query.matches)
    const listener = (event) => setHasHover(event.matches)
    if (query.addEventListener) {
      query.addEventListener('change', listener)
      return () => query.removeEventListener('change', listener)
    }
    if (query.addListener) {
      query.addListener(listener)
      return () => query.removeListener(listener)
    }
    return undefined
  }, [])

  useEffect(() => {
    return () => {
      clearAccountHoverTimeout()
      clearLanguageHoverTimeout()
    }
  }, [])

  useEffect(() => {
    if (!accountMenuOpen && !languageMenuOpen) {
      return
    }
    const handleClickOutside = (event) => {
      const withinAccount = accountMenuRef.current && accountMenuRef.current.contains(event.target)
      const withinLanguage = languageMenuRef.current && languageMenuRef.current.contains(event.target)
      if (!withinAccount && !withinLanguage) {
        setAccountMenuOpen(false)
        setLanguageMenuOpen(false)
      }
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false)
        setLanguageMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [accountMenuOpen, languageMenuOpen])

  const normalizedLanguage = useMemo(() => (i18n.language || 'en').split('-')[0], [i18n.language])

  const languageOptions = useMemo(
    () => [
      { code: 'ru', label: t('languages.ru') },
      { code: 'en', label: t('languages.en') }
    ],
    [t]
  )

  const currentLanguage = languageOptions.find((option) => option.code === normalizedLanguage) ?? languageOptions[0]

  const languageButtonLabel = t('menu.languageAria', { language: currentLanguage.label })

  const clearAccountHoverTimeout = () => {
    if (accountHoverTimeoutRef.current) {
      clearTimeout(accountHoverTimeoutRef.current)
      accountHoverTimeoutRef.current = null
    }
  }

  const scheduleAccountHoverClose = () => {
    clearAccountHoverTimeout()
    accountHoverTimeoutRef.current = window.setTimeout(() => {
      setAccountMenuOpen(false)
    }, 150)
  }

  const clearLanguageHoverTimeout = () => {
    if (languageHoverTimeoutRef.current) {
      clearTimeout(languageHoverTimeoutRef.current)
      languageHoverTimeoutRef.current = null
    }
  }

  const scheduleLanguageHoverClose = () => {
    clearLanguageHoverTimeout()
    languageHoverTimeoutRef.current = window.setTimeout(() => {
      setLanguageMenuOpen(false)
    }, 150)
  }
  const handleLanguagePointerEnter = () => {
    if (!hasHover) {
      return
    }
    clearLanguageHoverTimeout()
    setLanguageMenuOpen(true)
  }

  const handleLanguagePointerLeave = () => {
    if (!hasHover) {
      return
    }
    scheduleLanguageHoverClose()
  }

  const handleLanguageToggle = () => {
    if (hasHover) {
      return
    }
    clearLanguageHoverTimeout()
    setLanguageMenuOpen((prev) => !prev)
  }

  const handleLanguageSelect = (code) => {
    changeLanguage(code)
    setLanguageMenuOpen(false)
  }

  const initials = getInitials(auth.user?.profile)
  const role = auth.user?.profile?.role || auth.user?.profile?.roles?.[0] || null
  const normalizedRole = (role ?? '').toString().toUpperCase()
  const isAdmin = normalizedRole === 'ADMIN' || normalizedRole === 'ROLE_ADMIN'

  const handleSignIn = () => {
    if (auth.isLoading) {
      return
    }
    const returnUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    window.sessionStorage.setItem('easyshop:returnUrl', returnUrl)
    clearAccountHoverTimeout()
    setAccountMenuOpen(false)
    auth.signinRedirect({
      state: { returnUrl },
      extraQueryParams: { lang: normalizedLanguage, ui_locales: normalizedLanguage }
    }).catch(() => {})
  }

  const handleNavigate = (path) => {
    setAccountMenuOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    setAccountMenuOpen(false)
    window.sessionStorage.removeItem('easyshop:returnUrl')
    auth.signoutRedirect({ post_logout_redirect_uri: window.location.origin })
  }

  const handleAccountToggle = () => {
    if (hasHover) {
      return
    }
    clearAccountHoverTimeout()
    setAccountMenuOpen((prev) => !prev)
  }

  const handleAccountPointerEnter = () => {
    if (!hasHover) {
      return
    }
    clearAccountHoverTimeout()
    setAccountMenuOpen(true)
  }

  const handleAccountPointerLeave = () => {
    if (!hasHover) {
      return
    }
    scheduleAccountHoverClose()
  }

  const ariaLabel = auth.isAuthenticated
    ? t('menu.buttonSignedIn', 'Open account menu')
    : t('menu.buttonSignedOut', 'Open sign-in menu')

  const showAccountMenu = auth.isAuthenticated && accountMenuOpen
  const showGuestMenu = !auth.isAuthenticated && accountMenuOpen

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.brand}>
          EasyShop
        </Link>
        <div className={styles.spacer} />
        <div className={styles.controls}>
          <div
            className={styles.languageMenu}
            ref={languageMenuRef}
            onMouseEnter={handleLanguagePointerEnter}
            onMouseLeave={handleLanguagePointerLeave}
          >
            <button
              type="button"
              className={styles.languageButton}
              aria-haspopup="menu"
              aria-expanded={languageMenuOpen}
              aria-label={languageButtonLabel}
              onClick={handleLanguageToggle}
            >
              <span className={styles.languageIcon}>
                <GlobeIcon />
              </span>
              <span className={styles.languageCode}>{normalizedLanguage.toUpperCase()}</span>
            </button>
            {languageMenuOpen && (
              <div className={styles.dropdown} role="menu">
                {languageOptions.map((option) => {
                  const isActive = option.code === normalizedLanguage
                  const className = [styles.menuItem, isActive ? styles.menuItemActive : '']
                    .filter(Boolean)
                    .join(' ')
                  return (
                    <button
                      key={option.code}
                      type="button"
                      className={className}
                      onClick={() => handleLanguageSelect(option.code)}
                      role="menuitemradio"
                      aria-checked={isActive}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <div
            className={styles.authMenu}
            ref={accountMenuRef}
            onMouseEnter={handleAccountPointerEnter}
            onMouseLeave={handleAccountPointerLeave}
          >
            <button
              type="button"
              className={styles.authButton}
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              aria-label={ariaLabel}
              onClick={handleAccountToggle}
              disabled={auth.isLoading}
            >
              {auth.isAuthenticated && initials ? (
                <span className={styles.avatarInitials}>{initials}</span>
              ) : (
                <span className={styles.avatarIcon} aria-hidden="true">
                  <UserPlaceholderIcon />
                </span>
              )}
            </button>
            {showAccountMenu && (
              <div className={styles.dropdown} role="menu">
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => handleNavigate('/account')}
                  role="menuitem"
                >
                  {t('menu.profile')}
                </button>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => handleNavigate('/orders')}
                  role="menuitem"
                >
                  {t('menu.orders')}
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => handleNavigate('/admin')}
                    role="menuitem"
                  >
                    {t('menu.admin')}
                  </button>
                )}
                <div className={styles.menuDivider} />
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={handleLogout}
                  role="menuitem"
                >
                  {t('menu.logout')}
                </button>
              </div>
            )}
            {showGuestMenu && (
              <div className={styles.dropdown} role="menu">
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={handleSignIn}
                  role="menuitem"
                >
                  {t('menu.signIn')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
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
            <Route
              path="/orders"
              element={(
                <RequireAuth>
                  <OrdersPage />
                </RequireAuth>
              )}
            />
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




















