import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import RequireAuth from '../../auth/components/RequireAuth'

function extractRole(user) {
  const profile = user?.profile ?? {}
  return profile.role || profile.roles?.[0] || 'USER'
}

function AdminContent() {
  const auth = useAuth()
  const { t } = useTranslation()
  const role = extractRole(auth.user)

  return (
    <section>
      <h1>{t('admin.title')}</h1>
      <p>{t('admin.description')}</p>
      <p style={{ color: '#555' }}>{t('admin.yourRole')}: {role}</p>
    </section>
  )
}

export default function AdminPage() {
  return (
    <RequireAuth role="ADMIN">
      <AdminContent />
    </RequireAuth>
  )
}
