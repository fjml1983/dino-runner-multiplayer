import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

interface ScoreEntry {
  weekId: string
  score: number
  createdAt: string
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [bestScore, setBestScore] = useState<number>(0)

  useEffect(() => {
    api.get<{ scores: ScoreEntry[]; bestScore: number }>('/api/scores/me')
      .then((res) => {
        setScores(res.data.scores)
        setBestScore(res.data.bestScore)
      })
      .catch(() => {})
  }, [])

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
        <h1>Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h1>Profile</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <img
          src={user.picture}
          alt={user.name}
          style={{ width: 64, height: 64, borderRadius: '50%' }}
        />
        <div>
          <h2>{user.name}</h2>
          <p style={{ color: '#666' }}>{user.email}</p>
          <p><strong>All-time Best:</strong> {bestScore}</p>
        </div>
      </div>
      <button onClick={logout}>Logout</button>
      <h3>Score History</h3>
      {scores.length === 0 ? (
        <p>No scores yet.</p>
      ) : (
        <ul>
          {scores.map((s) => (
            <li key={s.weekId}>
              Week {s.weekId}: {s.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
