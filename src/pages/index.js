import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { LogoAsLoader as LoaderIcon } from '../components/Icons'

const LoaderWrapper = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/exchange/basic?network=xdai')
  }, [])

  return (
    <LoaderWrapper>
      <LoaderIcon size={'90px'} />
    </LoaderWrapper>
  )
}
