import { useMemo } from 'react'
import { parse } from 'query-string'

// TODO Unused right now. Check if we don't need it
export function useParsedQueryString() {
  const { search } = window.location
  return useMemo(() => {
    return search && search.length > 1
      ? parse(search, { parseArrays: false, ignoreQueryPrefix: true })
      : {}
  }, [search])
}
