import React, { useEffect, useState, useMemo } from 'react'
// import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from './useWeb3'

import { SUPPORTED_CHAINS_BY_NAME } from '../constants'
import { useMarketState } from '../state/market/hooks'

export const useCorrectNetworkURL = () => {
  const { chainId } = useActiveWeb3React()
  const { networkName } = useMarketState()

  return useMemo(() => {
    if (!chainId) return true
    return SUPPORTED_CHAINS_BY_NAME[networkName] === chainId
  }, [chainId])
}
