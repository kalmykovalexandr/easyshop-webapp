import styles from './Notice.module.css'

const FALLBACK_VARIANT = 'info'

export default function Notice({ children, variant = FALLBACK_VARIANT }) {
  const variantClass = styles[variant] ?? styles[FALLBACK_VARIANT]

  return (
    <div className={`${styles.notice} ${variantClass}`}>
      {children}
    </div>
  )
}