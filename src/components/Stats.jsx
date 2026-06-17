import './Stats.css'

const TYPE_COLORS = {
  vc: '#3b82f6',
  angel: '#8b5cf6',
  accelerator: '#10b981',
  grant_agency: '#f59e0b',
  corporate: '#ec4899',
  unknown: '#64748b',
}

export default function Stats({ stats }) {
  const cards = [
    { label: 'Investors & Funders', value: stats.investors?.toLocaleString(), icon: '🏦' },
    { label: 'Startups', value: stats.startups?.toLocaleString(), icon: '🚀' },
    { label: 'Grant Programs', value: stats.grants?.toLocaleString(), icon: '📋' },
    { label: 'Open Grants', value: stats.open_grants?.toLocaleString(), icon: '✅' },
  ]

  return (
    <div className="stats-wrap">
      <div className="stats-inner">
        <div className="stat-cards">
          {cards.map(c => (
            <div key={c.label} className="stat-card">
              <span className="stat-icon">{c.icon}</span>
              <span className="stat-value">{c.value}</span>
              <span className="stat-label">{c.label}</span>
            </div>
          ))}
        </div>
        {stats.types && (
          <div className="type-breakdown">
            {Object.entries(stats.types).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <span key={type} className="type-badge" style={{ borderColor: TYPE_COLORS[type] || '#64748b' }}>
                <span className="type-dot" style={{ background: TYPE_COLORS[type] || '#64748b' }} />
                {type} <strong>{count.toLocaleString()}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
