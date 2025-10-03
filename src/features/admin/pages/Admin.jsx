import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import RequireAuth from '../../auth/components/RequireAuth'

import styles from './Admin.module.css'

function extractRole(user) {
  const profile = user?.profile ?? {}
  return profile.role || profile.roles?.[0] || 'USER'
}

function AdminContent() {
  const auth = useAuth()
  const { t } = useTranslation()
  const role = extractRole(auth.user)

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{t('admin.title')}</h1>
      <p className={styles.description}>{t('admin.description')}</p>
      <p className={styles.roleLabel}>{t('admin.yourRole')}: {role}</p>
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