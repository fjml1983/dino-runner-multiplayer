import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RankingPage } from './RankingPage'

vi.mock('../api/client', () => ({
  api: {
    get: vi.fn().mockResolvedValue({
      data: [],
    }),
  },
}))

describe('RankingPage', () => {
  it('renders tabs', () => {
    render(
      <BrowserRouter>
        <RankingPage />
      </BrowserRouter>
    )
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('Last Week')).toBeInTheDocument()
    expect(screen.getByText('All Time')).toBeInTheDocument()
  })
})
