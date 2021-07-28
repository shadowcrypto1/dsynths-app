import { useMemo } from 'react'

import { useMarketState } from '../state/market/hooks'

export const useSignatureUrls = () => {
  const { networkName } = useMarketState()
  return useMemo(() => {
    return [
      `https://oracle1.deus.finance/${networkName.toLowerCase()}/signatures.json`,
      // `https://oracle2.deus.finance/${networkName.toLowerCase()}/signatures.json`,
      `https://oracle3.deus.finance/${networkName.toLowerCase()}/signatures.json`,
    ]
  }, [networkName])
}
