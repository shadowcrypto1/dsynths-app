import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/exchange/basic?network=xdai')
  }, [])

  return <p>Loading...</p>
}
