export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '50vh', color: '#555' }}>
      <p>{message}</p>
    </div>
  )
}

