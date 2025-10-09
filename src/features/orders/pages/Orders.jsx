import { useTranslation } from 'react-i18next'

import styles from './Orders.module.css'

export default function OrdersPage() {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('orders.title')}</h1>
        <p className={styles.subtitle}>{t('orders.subtitle')}</p>
      </header>
      <div className={styles.placeholder}>
        {t('orders.empty')}
      </div>
    </section>
  )
}
