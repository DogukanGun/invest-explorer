import { useTable } from './useTable'
import Pagination from './Pagination'
import './Table.css'

const TYPES = ['all', 'vc', 'angel', 'accelerator', 'grant_agency', 'corporate', 'unknown']
const TYPE_COLORS = { vc: '#3b82f6', angel: '#8b5cf6', accelerator: '#10b981', grant_agency: '#f59e0b', corporate: '#ec4899', unknown: '#64748b' }

function fmt(val) {
  if (!val) return '—'
  if (val >= 1e9) return '$' + (val / 1e9).toFixed(1) + 'B'
  if (val >= 1e6) return '$' + (val / 1e6).toFixed(1) + 'M'
  if (val >= 1e3) return '$' + (val / 1e3).toFixed(0) + 'K'
  return '$' + val
}

function filterFn(row, q, filters) {
  if (filters.type && filters.type !== 'all' && row.investor_type !== filters.type) return false
  if (!q) return true
  return (row.display_name || '').toLowerCase().includes(q) ||
    (row.hq_country || '').toLowerCase().includes(q) ||
    (row.hq_city || '').toLowerCase().includes(q)
}

export default function InvestorTable({ data }) {
  const { search, onSearch, filters, onFilter, paged, filtered, page, setPage, totalPages } = useTable(data, filterFn)

  return (
    <div>
      <div className="toolbar">
        <input className="search" placeholder="Search investors…" value={search} onChange={e => onSearch(e.target.value)} />
        <select className="filter-select" value={filters.type || 'all'} onChange={e => onFilter('type', e.target.value)}>
          {TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All types' : t}</option>)}
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>HQ</th>
              <th>Ticket Range</th>
              <th>Stage</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(row => (
              <tr key={row.id}>
                <td>
                  {row.website
                    ? <a href={row.website} target="_blank" rel="noreferrer" className="link">{row.display_name}</a>
                    : row.display_name}
                </td>
                <td>
                  <span className="badge" style={{ borderColor: TYPE_COLORS[row.investor_type] || '#64748b', color: TYPE_COLORS[row.investor_type] || '#64748b' }}>
                    {row.investor_type || '—'}
                  </span>
                </td>
                <td className="muted">{[row.hq_city, row.hq_country].filter(Boolean).join(', ') || '—'}</td>
                <td className="mono">
                  {row.ticket_min_usd || row.ticket_max_usd
                    ? (row.ticket_min_usd === row.ticket_max_usd ? fmt(row.ticket_min_usd) : `${fmt(row.ticket_min_usd)} – ${fmt(row.ticket_max_usd)}`)
                    : '—'}
                </td>
                <td className="muted small">{row.stage_focus ? JSON.parse(row.stage_focus).join(', ') : '—'}</td>
                <td className="muted small">{(row.source || '').split('|')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
    </div>
  )
}
