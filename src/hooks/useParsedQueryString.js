import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { parse } from 'query-string'

export function useParsedQueryString() {
  const { search } = useLocation()
  return useMemo(() => {
    return (search && search.length > 1) ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}
  })
}
