import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import LoadingScreen from '../../../shared/components/LoadingScreen'

function extractRole(user) {
  if (!user) return null
  const profile = user.profile ?? {}
  return profile.role || profile.roles?.[0] || profile['https://schemas.easyshop/role'] || null
}

export default function RequireAuth({ children, role }) {
  const auth = useAuth()
  const location = useLocation()
  const { t } = useTranslation()

  if (auth.isLoading) {
    return <LoadingScreen />
  }

  if (!auth.isAuthenticated) {
    window.sessionStorage.setItem('easyshop:returnUrl', location.pathname)
    auth.signinRedirect({ state: { returnUrl: location.pathname } })
    return <LoadingScreen message={t('auth.redirecting', 'Redirecting to sign-in page')} />
  }

  if (role) {
    const userRole = extractRole(auth.user)
    if (userRole !== role) {
      return <Navigate to="/account" replace />
    }
  }

  return children
}
