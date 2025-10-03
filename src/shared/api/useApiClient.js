import { useAuth } from 'react-oidc-context'

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

let authRedirectInFlight = false

function buildUrl(path) {
  if (!path) {
    return API_BASE || ''
  }
  if (path.startsWith('http')) {
    return path
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalized}`
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null
  }
  const text = await response.text()
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text)
  } catch (error) {
    return text
  }
}

function startAuthRedirect(signinRedirect) {
  if (authRedirectInFlight) {
    return
  }

  authRedirectInFlight = true
  const targetPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
  window.sessionStorage.setItem('easyshop:returnUrl', targetPath)

  signinRedirect({ state: { returnUrl: targetPath } }).finally(() => {
    authRedirectInFlight = false
  })
}

export function useApiClient() {
  const auth = useAuth()

  return async function request(path, options = {}) {
    const { body, headers = {}, method = 'GET', signal, ...rest } = options
    const token = auth.user?.access_token

    const requestHeaders = {
      Accept: 'application/json',
      ...headers
    }

    if (body && !('Content-Type' in requestHeaders)) {
      requestHeaders['Content-Type'] = 'application/json'
    }

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }

    const response = await fetch(buildUrl(path), {
      method,
      headers: requestHeaders,
      body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
      signal,
      ...rest
    })

    if (response.status === 401) {
      startAuthRedirect(auth.signinRedirect)
      throw new Error('????????? ???????????')
    }

    if (response.status === 403) {
      throw new Error('???????????? ????')
    }

    if (!response.ok) {
      const errorBody = await parseResponse(response)
      const message = typeof errorBody === 'string' ? errorBody : errorBody?.message ?? response.statusText
      throw new Error(message)
    }

    return parseResponse(response)
  }
}