import { useState, useMemo } from 'react'

export function useTable(data, filterFn, pageSize = 50) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return data.filter(row => filterFn(row, q, filters))
  }, [data, search, filters])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  function onSearch(val) { setSearch(val); setPage(1) }
  function onFilter(key, val) { setFilters(f => ({ ...f, [key]: val })); setPage(1) }

  return { search, onSearch, filters, onFilter, paged, filtered, page, setPage, totalPages }
}
