import { redirectToGoogle } from './auth'

describe('redirectToGoogle', () => {
  const originalLocation = window.location

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, href: '' },
      writable: true,
    })
  })

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    })
  })

  it('redirects to Google OAuth URL', () => {
    redirectToGoogle()
    expect(window.location.href).toContain('accounts.google.com/o/oauth2/v2/auth')
    expect(window.location.href).toContain('response_type=code')
    expect(window.location.href).toContain('scope=openid+email+profile')
  })
})
