import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/exchange/basic?network=xdai')
  }, [])

  // TODO show spinner here?
  return <p>Loading...</p>
}
