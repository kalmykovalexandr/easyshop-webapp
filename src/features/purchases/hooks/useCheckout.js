import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '../../../shared/api/useApiClient'
import { productsKey } from '../../products/hooks/useProducts'

export function useCheckout() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items) => api('/purchases/checkout', {
      method: 'POST',
      body: {
        items
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKey })
    }
  })
}
