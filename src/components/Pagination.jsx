import './Pagination.css'

export default function Pagination({ page, totalPages, setPage, total, pageSize }) {
  if (totalPages <= 1) return null
  const pages = []
  const delta = 2
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }
  return (
    <div className="pagination">
      <span className="pg-info">{total.toLocaleString()} results</span>
      <div className="pg-controls">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
        {pages.map((p, i) =>
          p === '…'
            ? <span key={i} className="pg-ellipsis">…</span>
            : <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
        )}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
      </div>
    </div>
  )
}
