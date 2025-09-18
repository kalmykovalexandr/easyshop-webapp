import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from 'react-oidc-context'
import { I18nextProvider } from 'react-i18next'

import i18n from '../shared/i18n'
import { oidcConfig } from '../features/auth/oidcConfig'

const queryClient = new QueryClient()

const onSigninCallback = (user) => {
  const returnUrl = user?.state?.returnUrl ?? window.sessionStorage.getItem('easyshop:returnUrl') ?? '/'
  window.history.replaceState({}, document.title, returnUrl)
}

export function AppProviders({ children }) {
  return (
    <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </AuthProvider>
  )
}

