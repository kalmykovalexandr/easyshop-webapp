import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function SuccessPage() {
  const { t } = useTranslation()
  return (
    <section style={{ padding: 32, textAlign: 'center' }}>
      <h1>{t('success.title')}</h1>
      <p>{t('success.message')}</p>
      <Link to="/shop">{t('success.backToShop')}</Link>
    </section>
  )
}
