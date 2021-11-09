import { useRef, useLayoutEffect } from 'react'

const useIsMounted = () => {
  const mounted = useRef(false)

  useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])

  return mounted
}

export default useIsMounted
