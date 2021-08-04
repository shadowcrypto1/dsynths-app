import { useMemo } from 'react'
// import { useWeb3React } from '@web3-react/core'

import { SUPPORTED_CHAINS_BY_NAME } from '../constants'
import { useMarketState } from '../state/market/hooks'
import { useWeb3React } from './useWeb3'

export const useCorrectNetworkURL = () => {
  const { chainId } = useWeb3React()
  const { networkName } = useMarketState()

  return useMemo(() => {
    if (!chainId) return true
    return SUPPORTED_CHAINS_BY_NAME[networkName] === chainId
  }, [chainId, networkName])
}
