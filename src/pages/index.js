import { useLayoutEffect } from 'react'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  useLayoutEffect(() => {
    router.push('/exchange/basic?network=xdai')
  }, [])

  return <p>Loading...</p>
}
