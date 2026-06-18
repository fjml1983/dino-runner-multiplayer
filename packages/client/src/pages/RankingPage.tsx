import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface RankingEntry {
  rank: number
  userId: string
  name: string
  avatar: string
  score: number
}

type Tab = 'current' | 'last' | 'all'

export function RankingPage() {
  const [tab, setTab] = useState<Tab>('current')
  const [entries, setEntries] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const url =
      tab === 'current'
        ? '/api/ranking/current'
        : tab === 'last'
        ? '/api/ranking/week/last'
        : '/api/ranking/all'

    api.get<RankingEntry[]>(url)
      .then((res) => setEntries(res.data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h1>Rankings</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['current', 'last', 'all'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              background: tab === t ? '#333' : '#eee',
              color: tab === t ? '#fff' : '#333',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {t === 'current' ? 'This Week' : t === 'last' ? 'Last Week' : 'All Time'}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Avatar</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.userId}>
                <td style={tdStyle}>{e.rank}</td>
                <td style={tdStyle}>
                  <img
                    src={e.avatar}
                    alt={e.name}
                    style={{ width: 24, height: 24, borderRadius: '50%' }}
                  />
                </td>
                <td style={tdStyle}>{e.name}</td>
                <td style={tdStyle}>{e.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: 8,
  textAlign: 'left',
  borderBottom: '2px solid #333',
}

const tdStyle: React.CSSProperties = {
  padding: 8,
  borderBottom: '1px solid #ddd',
}
