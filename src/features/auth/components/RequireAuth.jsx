import { useEffect, useRef } from 'react'
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
  const redirectingRef = useRef(false)
  const { isAuthenticated, isLoading, signinRedirect } = auth

  useEffect(() => {
    if (isLoading || isAuthenticated || redirectingRef.current) {
      return
    }

    const targetPath = `${location.pathname}${location.search}${location.hash}`
    redirectingRef.current = true
    window.sessionStorage.setItem('easyshop:returnUrl', targetPath)

    signinRedirect({ state: { returnUrl: targetPath } }).catch(() => {
      redirectingRef.current = false
    })
  }, [isAuthenticated, isLoading, location, signinRedirect])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
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