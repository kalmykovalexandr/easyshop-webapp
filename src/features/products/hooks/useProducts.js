import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '../../../shared/api/useApiClient'

const productsKey = ['products']

export function useProducts() {
  const api = useApiClient()

  return useQuery({
    queryKey: productsKey,
    queryFn: () => api('/products')
  })
}

export { productsKey }
