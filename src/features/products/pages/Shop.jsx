import { useMemo } from 'react'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import LoadingScreen from '../../../shared/components/LoadingScreen'
import { useProducts } from '../hooks/useProducts'
import { useCheckout } from '../../purchases/hooks/useCheckout'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB'
})

export default function ShopPage() {
  const { t } = useTranslation()
  const auth = useAuth()
  const { data, isLoading, isError, error } = useProducts()
  const checkout = useCheckout()

  const products = useMemo(() => data ?? [], [data])

  const handleCheckout = (product) => {
    if (!auth.isAuthenticated) {
      window.sessionStorage.setItem('easyshop:returnUrl', window.location.pathname)
      auth.signinRedirect({ state: { returnUrl: window.location.pathname } })
      return
    }

    checkout.mutate([{ productId: product.id, quantity: 1 }], {
      onSuccess: () => {
        alert(t('shop.order_done'))
      },
      onError: (mutationError) => {
        alert(mutationError.message)
      }
    })
  }

  if (isLoading) {
    return <LoadingScreen message={t('shop.loading')} />
  }

  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <h1>{t('shop.catalog')}</h1>
        <p style={{ color: 'red' }}>{error.message}</p>
        <button onClick={() => window.location.reload()}>{t('shop.retry')}</button>
      </div>
    )
  }

  return (
    <section style={{ display: 'grid', gap: 24 }}>
      <header>
        <h1>{t('shop.catalog')}</h1>
        <p style={{ color: '#555' }}>{t('shop.description')}</p>
      </header>

      {products.length === 0 ? (
        <div style={{ padding: 24, border: '1px dashed #ccc', borderRadius: 12, textAlign: 'center' }}>
          {t('shop.no_products')}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {products.map((product) => (
            <article key={product.id} style={{ border: '1px solid #eee', borderRadius: 16, padding: 16, display: 'grid', gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{product.name}</h2>
                <p style={{ margin: 0, color: '#666' }}>{product.description ?? t('shop.no_description')}</p>
              </div>
              <dl style={{ margin: 0, display: 'grid', gap: 4, color: '#555' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <dt>{t('shop.price')}</dt>
                  <dd style={{ margin: 0 }}>{currencyFormatter.format(Number(product.price ?? 0))}</dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <dt>{t('shop.stock')}</dt>
                  <dd style={{ margin: 0 }}>{product.stock}</dd>
                </div>
              </dl>
              <button
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
