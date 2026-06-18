import axios from 'axios'
import { api } from './client'

vi.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    defaults: {},
  }
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  }
})

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates axios instance with baseURL /api', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: '/api' })
    )
  })

  it('adds Authorization header when token exists', () => {
    const token = 'test-jwt'
    localStorage.setItem('token', token)

    const requestInterceptor = (api.interceptors.request.use as ReturnType<typeof vi.fn>).mock.calls[0][0]
    const config = requestInterceptor({ headers: {} })

    expect(config.headers.Authorization).toBe(`Bearer ${token}`)
  })

  it('skips Authorization header when no token', () => {
    const requestInterceptor = (api.interceptors.request.use as ReturnType<typeof vi.fn>).mock.calls[0][0]
    const config = requestInterceptor({ headers: {} })

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('removes token and redirects on 401 response', () => {
    localStorage.setItem('token', 'expired-jwt')
    const responseInterceptor = (api.interceptors.response.use as ReturnType<typeof vi.fn>).mock.calls[0][1]

    const error = { response: { status: 401 } }
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    responseInterceptor(error).catch(() => {})

    expect(localStorage.getItem('token')).toBeNull()
    consoleSpy.mockRestore()
  })
})
