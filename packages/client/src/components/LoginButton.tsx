interface LoginButtonProps {
  user?: { name: string; picture: string }
  onLogin: () => void
  onLogout?: () => void
  loading?: boolean
}

export function LoginButton({ user, onLogin, onLogout, loading }: LoginButtonProps) {
  if (loading) {
    return <button disabled>Signing in...</button>
  }

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src={user.picture}
          alt={user.name}
          style={{ width: 32, height: 32, borderRadius: '50%' }}
        />
        <span>{user.name}</span>
        {onLogout && <button onClick={onLogout}>Logout</button>}
      </div>
    )
  }

  return <button onClick={onLogin}>Sign in with Google</button>
}
