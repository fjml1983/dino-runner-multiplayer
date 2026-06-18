export function redirectToGoogle() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const redirectUri = `${window.location.origin}/api/auth/google/callback`
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
  })
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}
