import { useTable } from './useTable'
import Pagination from './Pagination'
import './Table.css'

const STATUS_COLORS = { open: '#10b981', forecast: '#f59e0b', closed: '#ef4444', unknown: '#64748b' }

function fmt(val) {
  if (!val) return null
  if (val >= 1e6) return '$' + (val / 1e6).toFixed(1) + 'M'
  if (val >= 1e3) return '$' + (val / 1e3).toFixed(0) + 'K'
  return '$' + val
}

// Top grant agencies by volume
const TOP_AGENCIES = [
  'National Institutes of Health',
  'Dept. of the Army -- USAMRAA',
  'Substance Abuse and Mental Health Services Admin',
  'Health Resources and Services Administration',
  'National Institute of Food and Agriculture',
  'Department of Housing and Urban Development',
  'National Park Service',
  'Employment and Training Administration',
  'Bureau Of Educational and Cultural Affairs',
  'Administration for Children and Families - ORR',
]

function filterFn(row, q, filters) {
  if (filters.type && filters.type !== 'all' && row.grant_type !== filters.type) return false
  if (filters.status && filters.status !== 'all' && row.status !== filters.status) return false
  if (filters.agency && row.agency !== filters.agency) return false
  if (!q) return true
  return (
    (row.program_name || '').toLowerCase().includes(q) ||
    (row.agency || '').toLowerCase().includes(q) ||
    (row.grant_type || '').toLowerCase().includes(q)
  )
}

export default function GrantTable({ data }) {
  const { search, onSearch, filters, onFilter, paged, filtered, page, setPage, totalPages } =
    useTable(data, filterFn)

  return (
    <div>
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by program, agency, type…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        <select className="filter-select" value={filters.status || 'all'} onChange={e => onFilter('status', e.target.value)}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="forecast">Forecast</option>
          <option value="closed">Closed</option>
        </select>
        <select className="filter-select" value={filters.type || 'all'} onChange={e => onFilter('type', e.target.value)}>
          <option value="all">All types</option>
          <option value="nih">NIH</option>
          <option value="nsf">NSF</option>
          <option value="sbir">SBIR</option>
          <option value="sttr">STTR</option>
          <option value="other">Other</option>
        </select>
        <select className="filter-select" value={filters.agency || ''} onChange={e => onFilter('agency', e.target.value)}>
          <option value="">All agencies</option>
          {TOP_AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Program</th>
              <th>Agency</th>
              <th>Type</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(row => (
              <tr key={row.id}>
                <td>
                  {row.url
                    ? <a href={row.url} target="_blank" rel="noreferrer" className="link">{row.program_name}</a>
                    : row.program_name}
                </td>
                <td className="muted small">{row.agency || '—'}</td>
                <td><span className="batch-badge">{(row.grant_type || '—').toUpperCase()}</span></td>
                <td>
                  <span className="badge" style={{ borderColor: STATUS_COLORS[row.status] || '#64748b', color: STATUS_COLORS[row.status] || '#64748b' }}>
                    {row.status || '—'}
                  </span>
                </td>
                <td className="mono small">
                  {fmt(row.amount_min_usd) || fmt(row.amount_max_usd)
                    ? `${fmt(row.amount_min_usd) || '?'} – ${fmt(row.amount_max_usd) || '?'}`
                    : '—'}
                </td>
                <td className="muted small">{row.deadline || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
    </div>
  )
}
