const authority = import.meta.env.VITE_AUTH_SERVER_URL

if (!authority) {
  console.warn('VITE_AUTH_SERVER_URL is not set. OIDC authentication will not work correctly.')
}

const redirectUri = `${window.location.origin}/auth/callback`
const postLogoutRedirectUri = window.location.origin

export const oidcConfig = {
  authority,
  client_id: 'webapp',
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,
  response_type: 'code',
  scope: 'openid profile read write',
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: true
}
