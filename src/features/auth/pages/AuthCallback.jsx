import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import LoadingScreen from '../../../shared/components/LoadingScreen'

export default function AuthCallback() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      const returnUrl = auth.user?.state?.returnUrl ?? window.sessionStorage.getItem('easyshop:returnUrl') ?? '/'
      navigate(returnUrl, { replace: true })
    }
  }, [auth.isAuthenticated, auth.user, navigate])

  if (auth.error) {
    return <div style={{ padding: 24 }}>?????? ??????????????: {auth.error.message}</div>
  }

  return <LoadingScreen message="????????? ????..." />
}
