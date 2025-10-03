import { useEffect, useMemo, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import LoadingScreen from '../../../shared/components/LoadingScreen'
import Notice from '../../../shared/components/Notice'
import { useProducts } from '../hooks/useProducts'
import { useCheckout } from '../../purchases/hooks/useCheckout'

import styles from './Shop.module.css'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB'
})

export default function ShopPage() {
  const { t } = useTranslation()
  const auth = useAuth()
  const { data, isLoading, isError, error, refetch } = useProducts()
  const checkout = useCheckout()
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (!feedback) {
      return
    }
    const timeoutId = window.setTimeout(() => setFeedback(null), 4000)
    return () => window.clearTimeout(timeoutId)
  }, [feedback])

  const products = useMemo(() => data ?? [], [data])

  const ensureAuthenticated = () => {
    if (auth.isAuthenticated) {
      return true
    }

    const targetPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
    window.sessionStorage.setItem('easyshop:returnUrl', targetPath)
    auth.signinRedirect({ state: { returnUrl: targetPath } })
    return false
  }

  const handleCheckout = (product) => {
    if (!ensureAuthenticated()) {
      return
    }

    checkout.mutate([{ productId: product.id, quantity: 1 }], {
      onSuccess: () => {
        setFeedback({ type: 'success', message: t('shop.order_done') })
      },
      onError: (mutationError) => {
        setFeedback({ type: 'error', message: mutationError.message })
      }
    })
  }

  if (isLoading) {
    return <LoadingScreen message={t('shop.loading')} />
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <header className={styles.header}>
          <h1>{t('shop.catalog')}</h1>
          <p className={styles.subtitle}>{t('shop.description')}</p>
        </header>
        <Notice variant="error">
          <div className={styles.errorContent}>
            <p>{error.message}</p>
            <button type="button" className={styles.retryButton} onClick={() => refetch()}>
              {t('shop.retry')}
            </button>
          </div>
        </Notice>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1>{t('shop.catalog')}</h1>
        <p className={styles.subtitle}>{t('shop.description')}</p>
      </header>

      {feedback && (
        <Notice variant={feedback.type}>
          {feedback.message}
        </Notice>
      )}

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          {t('shop.no_products')}
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <article key={product.id} className={styles.card}>
              <div>
                <h2 className={styles.cardTitle}>{product.name}</h2>
                <p className={styles.cardDescription}>
                  {product.description ?? t('shop.no_description')}
                </p>
              </div>
              <dl className={styles.cardDetails}>
                <div className={styles.cardDetailRow}>
                  <dt>{t('shop.price')}</dt>
                  <dd>{currencyFormatter.format(Number(product.price ?? 0))}</dd>
                </div>
                <div className={styles.cardDetailRow}>
                  <dt>{t('shop.stock')}</dt>
                  <dd>{product.stock}</dd>
                </div>
              </dl>
              <button
                type="button"
                className={styles.buyButton}
                disabled={checkout.isPending}
                onClick={() => handleCheckout(product)}
              >
                {t('shop.buy_one')}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}