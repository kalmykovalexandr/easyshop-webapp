import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>{message}</p>
    </div>
  )
}