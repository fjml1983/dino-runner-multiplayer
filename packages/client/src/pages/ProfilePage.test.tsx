import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProfilePage } from './ProfilePage'
import { AuthProvider } from '../context/AuthContext'

vi.mock('../api/client', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: { scores: [], bestScore: 0 } }),
  },
}))

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: null,
    logout: vi.fn(),
  }),
}))

describe('ProfilePage', () => {
  it('renders prompts to login when not authenticated', () => {
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    )
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Please log in to view your profile.')).toBeInTheDocument()
  })
})
