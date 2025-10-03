import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import LoadingScreen from '../../../shared/components/LoadingScreen'

import styles from './AuthCallback.module.css'

export default function AuthCallback() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (auth.isAuthenticated) {
      const returnUrl = auth.user?.state?.returnUrl ?? window.sessionStorage.getItem('easyshop:returnUrl') ?? '/'
      navigate(returnUrl, { replace: true })
    }
  }, [auth.isAuthenticated, auth.user, navigate])

  if (auth.error) {
    return (
      <div className={styles.error}>
        {t('auth.error')}: {auth.error.message}
      </div>
    )
  }

  return <LoadingScreen message={t('auth.processing')} />
}