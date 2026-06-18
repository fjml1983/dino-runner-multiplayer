import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

vi.mock('../api/client', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn().mockResolvedValue({ data: {} }),
  },
}))

import { api } from '../api/client'

function TestConsumer() {
  const { user, token, login, logout, loading } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="token">{token ?? 'null'}</span>
      <span data-testid="user">{user ? user.displayName : 'null'}</span>
      <button data-testid="login" onClick={() => login('test-code')}>Login</button>
      <button data-testid="logout" onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('provides default context shape', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('token')).toHaveTextContent('null')
    expect(screen.getByTestId('user')).toHaveTextContent('null')
  })

  it('stores token on login', async () => {
    const mockUser = { id: '1', displayName: 'Test User', email: 'test@example.com', avatar: '' }
    const userData = { data: mockUser }
    ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { token: 'test-jwt', user: mockUser },
    })
    ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(userData)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await userEvent.click(screen.getByTestId('login'))

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-jwt')
      expect(screen.getByTestId('token')).toHaveTextContent('test-jwt')
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })
  })
})
