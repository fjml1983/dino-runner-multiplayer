import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginButton } from './LoginButton'

const mockUseGoogleLogin = vi.fn()

vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: () => mockUseGoogleLogin,
}))

describe('LoginButton', () => {
  it('renders Sign in button when logged out', () => {
    render(<LoginButton onLogin={vi.fn()} />)
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument()
  })

  it('shows avatar and name when logged in', () => {
    render(
      <LoginButton
        user={{ name: 'Test User', picture: 'https://example.com/avatar.png' }}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />
    )
    expect(screen.getByText('Test User')).toBeInTheDocument()
    const img = screen.getByAltText('Test User')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png')
  })

  it('calls onLogin when Sign in button clicked', async () => {
    const onLogin = vi.fn()
    render(<LoginButton onLogin={onLogin} />)
    await userEvent.click(screen.getByText('Sign in with Google'))
    expect(onLogin).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<LoginButton onLogin={vi.fn()} loading />)
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
  })
})
