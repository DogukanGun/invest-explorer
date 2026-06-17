import { useTable } from './useTable'
import Pagination from './Pagination'
import './Table.css'

const STATUS_COLORS = { Active: '#10b981', Inactive: '#ef4444', Acquired: '#f59e0b', Public: '#3b82f6' }

function filterFn(row, q, filters) {
  if (filters.batch && row.batch !== filters.batch) return false
  if (!q) return true
  return (row.display_name || '').toLowerCase().includes(q) ||
    (row.batch || '').toLowerCase().includes(q) ||
    (row.sector || '').toLowerCase().includes(q)
}

export default function StartupTable({ data }) {
  const batches = ['all', ...Array.from(new Set(data.map(r => r.batch).filter(Boolean))).sort().reverse()]
  const { search, onSearch, filters, onFilter, paged, filtered, page, setPage, totalPages } = useTable(data, filterFn)

  return (
    <div>
      <div className="toolbar">
        <input className="search" placeholder="Search startups…" value={search} onChange={e => onSearch(e.target.value)} />
        <select className="filter-select" value={filters.batch || 'all'} onChange={e => onFilter('batch', e.target.value === 'all' ? '' : e.target.value)}>
          {batches.map(b => <option key={b} value={b}>{b === 'all' ? 'All batches' : b}</option>)}
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Batch</th>
              <th>Status</th>
              <th>Sector</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(row => {
              const sectors = row.sector ? (() => { try { return JSON.parse(row.sector) } catch { return [] } })() : []
              return (
                <tr key={row.id}>
                  <td>
                    {row.website
                      ? <a href={row.website} target="_blank" rel="noreferrer" className="link">{row.display_name}</a>
                      : row.display_name}
                  </td>
                  <td><span className="batch-badge">{row.batch || '—'}</span></td>
                  <td>
                    {row.status
                      ? <span className="badge" style={{ borderColor: STATUS_COLORS[row.status] || '#64748b', color: STATUS_COLORS[row.status] || '#64748b' }}>{row.status}</span>
                      : <span className="muted">—</span>}
                  </td>
                  <td className="muted small">{sectors.slice(0, 3).join(', ') || '—'}</td>
                  <td className="muted">{row.team_size || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
    </div>
  )
}
