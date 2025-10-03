import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from './Success.module.css'

export default function SuccessPage() {
  const { t } = useTranslation()
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{t('success.title')}</h1>
      <p className={styles.message}>{t('success.message')}</p>
      <Link className={styles.link} to="/shop">{t('success.backToShop')}</Link>
    </section>
  )
}